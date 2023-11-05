import { Single } from '@/util';
import { equalArrayReferences } from '@/util/signals/internal/equalArrayReferences';
import { SafeUnwrapSignals } from '@/util/signals/internal/SafeUnwrapSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { safeComputed } from '@/util/signals/safeComputed';
import { FullAsyncSignal, toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { WritableAsyncSignal } from '@/util/signals/WritableAsyncSignal';
import { Tuple } from '@/util/types/Tuple';
import { inject, Injector, signal, Signal } from '@angular/core';
import { of, ReplaySubject, startWith, switchMap, tap } from 'rxjs';

export type SignalResource<T> =
    WritableAsyncSignal<T>
    & {
        loading$: Signal<boolean>; // call will NOT activate request
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

    const loading$ = signal(false);
	const setLoading = (loading: boolean) => setTimeout(() => loading$.set(loading)); // computed have no allowSignalWrites option & untracked is not working

    let lastValues: SafeUnwrapSignals<ST> | undefined;
    let sourceValuesSubject$ = new ReplaySubject<SafeUnwrapSignals<ST> | undefined>(1);

    const asyncSignal: FullAsyncSignal<R> = toAsyncSignal(
        sourceValuesSubject$.pipe(
            switchMap((values: SafeUnwrapSignals<ST> | undefined) => {
				if (!values) {
					return of(undefined) as Single<R>;
				}
				setLoading(true);
                return call(...values).pipe(
					tap(() => setLoading(false)),
					startWith(undefined as R)
				)
            })
        ),
        {
            ...options,
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
        loading$
    })
}
