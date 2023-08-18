import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { assertInInjectionContext, computed, DestroyRef, inject, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { ToSignalOptions } from '@angular/core/rxjs-interop';
import { Falsy, Observable, Subscribable, Unsubscribable } from 'rxjs';

export type FullAsyncSignal<T> =
    AsyncSignal<T>
    & Omit<WritableSignal<T>, 'mutate'>
    & {
        error: Signal<unknown | undefined>; // call will NOT activate request (TODO confirm)
    };

const NOT_LOADED = Symbol('NOT_LOADED');

export type ToAsyncSignalOptions<T> = Pick<ToSignalOptions<T>, 'injector' | 'initialValue'> & {
    runInComputedContext?: () => void
};

export function toAsyncSignal<T, U extends T | undefined = undefined>(
    source: Observable<T>|Subscribable<T>,
    options?: ToAsyncSignalOptions<U>
): FullAsyncSignal<T | Exclude<U, undefined>> {
    !options?.injector && assertInInjectionContext(toAsyncSignal);
    const destroyRef: DestroyRef = options?.injector?.get(DestroyRef) ?? inject(DestroyRef);

    const writableSignal = signal<T | typeof NOT_LOADED>(NOT_LOADED);
    const error = signal<unknown | undefined>(undefined);

    let subscription: Unsubscribable | undefined;

    const baseResult = computed(
        () => {
            options?.runInComputedContext?.()

            if (!subscription) {
                subscription = source.subscribe({
                    next: (value: T) => untracked(() => {
                        writableSignal.set(value);
                    }),
                    error: error => untracked(() => error.set(error))
                });
                destroyRef.onDestroy(subscription.unsubscribe.bind(subscription))
            }

            return writableSignal();
        }
    );

    const result: Signal<T | Exclude<U, Falsy>> = computed(() => {
        const value = baseResult();
        if (value === NOT_LOADED) {
            if (options?.initialValue) {
                return options.initialValue;
            }
            throw new Error('Value not yet loaded. Check ready() before getting value, or provide initialValue option.');
        } else {
            return value;
        }
    })

    const ready: Signal<boolean> = computed(() => {
        const result = baseResult();
        return result !== NOT_LOADED;
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
        // mutate: (_mutateFn: (value: R) => void) => {
        //     throw new Error('Mutate is not working on FullAsyncSignal');
        // },
        asReadonly: () => result,
        ready,
        error,
    })
}
