import { Single } from '@/util';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { equalArrayReferences } from '@/util/signals/internal/equalArrayReferences';
import { SafeUnwrapSignals } from '@/util/signals/internal/SafeUnwrapSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { safeComputed } from '@/util/signals/safeComputed';
import { Tuple } from '@/util/types/Tuple';
import { computed, DestroyRef, inject, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { ReplaySubject, Subscription, switchMap } from 'rxjs';

export type SignalResource<T> = Exclude<WritableSignal<T>, 'mutate'>
    & AsyncSignal<T>
    & {
        loading: Signal<boolean>; // call will NOT activate request
        error: Signal<undefined | unknown>; // call will NOT activate request (TODO confirm)
    };

type SignalResourceOptions<T> = { initialValue?: T };

const NOT_LOADED = Symbol('NOT_LOADED');

export function signalResource<R>(asyncCall: () => Single<R>, options: SignalResourceOptions<R>): SignalResource<R>;
export function signalResource<R>(asyncCall: () => Single<R>): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>, options: SignalResourceOptions<R>): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>): SignalResource<R>;
export function signalResource<ST extends Tuple<Signal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapSignals<ST>) => Single<R>]
             | [...ST, (...values: SafeUnwrapSignals<ST>) => Single<R>, SignalResourceOptions<R>]
): SignalResource<R>;


export function signalResource<ST extends Tuple<Signal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapSignals<ST>) => Single<R>]
             | [...ST, (...values: SafeUnwrapSignals<ST>) => Single<R>, SignalResourceOptions<R>]
): SignalResource<R> {
    const { source, call, options} = splitParams<ST, (...values: SafeUnwrapSignals<ST>) => Single<R>, SignalResourceOptions<R>>(...params);

    const sourceValues: Signal<SafeUnwrapSignals<ST> | undefined> = safeComputed(
        ...source,
        (...sourceValues: any[]) => sourceValues as SafeUnwrapSignals<ST>,
        { equal: equalArrayReferences }
    );

    const destroyRef: DestroyRef = inject(DestroyRef);

    const writableSignal = signal<R | typeof NOT_LOADED>(NOT_LOADED);
    const error = signal<unknown | undefined>(undefined);
    const loading = signal(false);

    let lastValues: SafeUnwrapSignals<ST> | undefined;
    let sourceValuesSubject$ = new ReplaySubject<SafeUnwrapSignals<ST>>(1);
    let subscription: Subscription | undefined;

    const baseResult = computed(
        () => {
            const values: SafeUnwrapSignals<ST> | undefined = sourceValues();
            if (!values || values === lastValues) {
                return writableSignal();
            }

            lastValues = values;
            sourceValuesSubject$.next(values);

            if (!subscription) {
                subscription = sourceValuesSubject$.pipe(
                    switchMap((values: SafeUnwrapSignals<ST>) => {
                        untracked(() => loading.set(true));
                        return call(...values)
                    })
                ).subscribe({
                    next: (value: R) => untracked(() => {
                        writableSignal.set(value);
                        loading.set(false);
                    }),
                    error: error => untracked(() => error.set(error))
                });
                destroyRef.onDestroy(subscription.unsubscribe.bind(subscription))
            }

            return writableSignal();
        }
    );

    const result: Signal<R> = computed(() => {
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
        set: (value: R) => writableSignal.set(value),
        update: (updateFn: (value: R) => R) => writableSignal.update((value: R | typeof NOT_LOADED) => {
            if (value === NOT_LOADED) {
                throw new Error('Value not yet loaded. Check ready() before setting value, or provide initialValue option.');
            } else {
                return updateFn(value);
            }
        }),
        mutate: (_mutateFn: (value: R) => void) => {
            throw new Error('Mutate is not working on SignalResource');
        },
        asReadonly: () => result,
        ready,
        loading,
        error,
    })
}
