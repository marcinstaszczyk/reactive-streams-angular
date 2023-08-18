import { Single } from '@/util';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { equalArrayReferences } from '@/util/signals/internal/equalArrayReferences';
import { SafeUnwrapSignals } from '@/util/signals/internal/SafeUnwrapSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { safeComputed } from '@/util/signals/safeComputed';
import { FullAsyncSignal, toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { Tuple } from '@/util/types/Tuple';
import { inject, Injector, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { ReplaySubject, switchMap, tap } from 'rxjs';

export type SignalResource<T> = Omit<WritableSignal<T>, 'mutate'>
    & AsyncSignal<T>
    & {
        loading: Signal<boolean>; // call will NOT activate request
    };

type SignalResourceOptions<T> = { initialValue?: T };

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

    const injector: Injector = inject(Injector);

    const loading = signal(false);

    let lastValues: SafeUnwrapSignals<ST> | undefined;
    let sourceValuesSubject$ = new ReplaySubject<SafeUnwrapSignals<ST>>(1);

    const asyncSignal: FullAsyncSignal<R> = toAsyncSignal(
        sourceValuesSubject$.pipe(
            switchMap((values: SafeUnwrapSignals<ST>) => {
                untracked(() => loading.set(true));
                return call(...values)
            }),
            tap(() => untracked(() => loading.set(false)))
        ),
        {
            injector,
            runInComputedContext: () => {
                const values: SafeUnwrapSignals<ST> | undefined = sourceValues();
                if (!values || values === lastValues) {
                    return;
                }

                lastValues = values;
                sourceValuesSubject$.next(values);
            }
        }
    );

    return Object.assign(asyncSignal, {
        loading
    })
}
