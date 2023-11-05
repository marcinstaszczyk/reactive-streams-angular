import { WritableAsyncSignal } from '@/util/signals/WritableAsyncSignal';
import { assertInInjectionContext, computed, DestroyRef, inject, Signal, signal, untracked } from '@angular/core';
import { ToSignalOptions } from '@angular/core/rxjs-interop';
import { Observable, Subscribable, Unsubscribable } from 'rxjs';

export type FullAsyncSignal<T, U = undefined> =
    WritableAsyncSignal<T, U>
    & {
        error$: Signal<unknown | undefined>; // call will NOT activate request (TODO confirm)
    };

const NOT_LOADED = Symbol('NOT_LOADED');

export type ToAsyncSignalOptions<U> = Pick<ToSignalOptions<U>, 'injector' | 'initialValue'> & {
    runInComputedContext?: () => void
};

export function toAsyncSignal<T, U = undefined>(
    source: Observable<T>|Subscribable<T>,
    options?: ToAsyncSignalOptions<U>
): FullAsyncSignal<T, U> {
    !options?.injector && assertInInjectionContext(toAsyncSignal);
    const destroyRef: DestroyRef = options?.injector?.get(DestroyRef) ?? inject(DestroyRef);

    const writableSignal = signal<T | typeof NOT_LOADED>(NOT_LOADED);
    const error$ = signal<unknown | undefined>(undefined);
	const setError = (error: unknown) => setTimeout(() => error$.set(error)); // computed have no allowSignalWrites option & untracked is not working

    let subscription: Unsubscribable | undefined;

    const baseResult: Signal<T | typeof NOT_LOADED> = computed(
        () => {
            options?.runInComputedContext?.()

            if (!subscription) {
                subscription = source.subscribe({
                    next: (value: T) => untracked(() => {
                        writableSignal.set(value);
                    }),
                    error: error => setError(error)
                });
                destroyRef.onDestroy(subscription.unsubscribe.bind(subscription))
            }

            return writableSignal();
        }
    );

    const result: Signal<T | U> = computed(() => {
        const value: T | typeof NOT_LOADED = baseResult();
        if (value === NOT_LOADED) {
            return options?.initialValue as U;
        } else {
            return value;
        }
    })

    return Object.assign(result, {
        set: (value: T) => writableSignal.set(value),
        update: (updateFn: (value: T) => T) => writableSignal.update((value: T | typeof NOT_LOADED) => {
            if (value === NOT_LOADED) {
                throw new Error('Value not yet loaded. Check ready() before setting value, or provide initialValue option.');
            } else {
                return updateFn(value);
            }
        }),
        error$,
    })
}
