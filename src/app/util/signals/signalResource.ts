import { Single } from '@/util';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { equalArrayReferences } from '@/util/signals/internal/equalArrayReferences';
import { SafeUnwrapSignals } from '@/util/signals/internal/SafeUnwrapSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { safeComputed } from '@/util/signals/safeComputed';
import { Tuple } from '@/util/types/Tuple';
import { computed, inject, Injector, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { mergeWith, ReplaySubject, startWith, Subject, switchMap, tap } from 'rxjs';

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
    const injector = inject(Injector);

    const { source, call, options} = splitParams<ST, (...values: SafeUnwrapSignals<ST>) => Single<R>, SignalResourceOptions<R>>(...params);

    const sourceValues: Signal<SafeUnwrapSignals<ST> | undefined> = safeComputed(
        ...source,
        (...sourceValues: any[]) => sourceValues as SafeUnwrapSignals<ST>,
        { equal: equalArrayReferences }
    );

    let sourceValuesSubject$ = new ReplaySubject<SafeUnwrapSignals<ST>>(1);
    let signalFromObservable: Signal<R | typeof NOT_LOADED> | undefined;
    const loading = signal(false);
    const error = signal<undefined | unknown>(undefined);

    let lastValues: SafeUnwrapSignals<ST> | undefined;
    const resultSubject$ = new Subject<R>();

    const baseResult = computed(
        () => {
            const values: SafeUnwrapSignals<ST> | undefined = sourceValues();
            if (!values || values === lastValues) {
                return signalFromObservable?.();
            }

            lastValues = values;
            sourceValuesSubject$.next(values);

            if (!signalFromObservable) {
                signalFromObservable = toSignal(
                    sourceValuesSubject$.pipe(
                        switchMap((values: SafeUnwrapSignals<ST>) => {
                            untracked(() => loading.set(true));
                            return call(...values)
                        }),
                        tap({
                            next: () => untracked(() => loading.set(false)),
                            error: (e) => untracked(() => error.set(e))
                        }),
                        mergeWith(resultSubject$),
                        startWith(NOT_LOADED)
                    ),
                    { initialValue: NOT_LOADED, injector }
                );
            }
            return signalFromObservable();
        }
    ) as SignalResource<R | typeof NOT_LOADED>;

    const result: Signal<R> = computed(() => {
        const result = baseResult();
        if (result === NOT_LOADED) {
            if (options?.initialValue) {
                return options.initialValue;
            }
            throw new Error('Value not yet loaded. Check ready() before getting value, or provide initialValue option.');
        } else {
            return result;
        }
    })

    const ready: Signal<boolean> = computed(() => {
        const result = baseResult();
        return result !== NOT_LOADED;
    })

    return Object.assign(result, {
        set: (value: R) => resultSubject$.next(value),
        update: (updateFn: (value: R) => R) => resultSubject$.next(updateFn(result())),
        mutate: (_mutateFn: (value: R) => void) => {
            throw new Error('Mutate is not working on SignalResource');
            // mutateFn(baseResult());
            // resultSubject$.next(baseResult());
        },
        asReadonly: () => result,
        ready,
        loading,
        error,
    })
}
