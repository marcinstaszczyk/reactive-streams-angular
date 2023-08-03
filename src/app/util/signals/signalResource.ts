import { Single } from '@/util';
import { computed, inject, Injector, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReplaySubject, switchMap, tap } from 'rxjs';

export interface SignalResource<T> extends Signal<T> {
    // TOOD do we need this? ready: Signal<boolean>; // call will activate request
    loading: Signal<boolean>; // call will NOT activate request
    error: Signal<undefined | unknown>; // call will NOT activate request (TODO confirm)
}

type Tuple<T> = readonly T[];

type SignalResourceOptions<T> = { initialValue?: T };

type UnwrapSignals<SA extends Tuple<Signal<any>>> =
    SA extends never[] ? never[] :
    SA extends [Signal<infer P>, ...infer Tail extends Tuple<Signal<unknown>>]
        ? [Exclude<P, undefined | false>, ...UnwrapSignals<Tail>]
        : never;

export function signalResource<SA extends Tuple<Signal<any>>, R>(
    ...params: [...SA, (...values: UnwrapSignals<SA>) => Single<R>, SignalResourceOptions<R> & { initialValue: R }]
): SignalResource<R>;
export function signalResource<SA extends Tuple<Signal<any>>, R>(
    ...params: [...SA, (...values: UnwrapSignals<SA>) => Single<R>]
             | [...SA, (...values: UnwrapSignals<SA>) => Single<R>, SignalResourceOptions<R>]
): SignalResource<R | undefined>;
export function signalResource<SA extends Tuple<Signal<any>>, R>(
    ...params: [...SA, (...values: UnwrapSignals<SA>) => Single<R>]
             | [...SA, (...values: UnwrapSignals<SA>) => Single<R>, SignalResourceOptions<R>]
): SignalResource<R | undefined> {
    const injector = inject(Injector);
    const lastParam = params.pop() as SignalResourceOptions<any> | Function;

    let options: SignalResourceOptions<any>;
    let asyncCall: (...values: UnwrapSignals<SA>) => Single<R>;
    if (isSignalResourceOptions(lastParam)) {
        options = lastParam;
        asyncCall = params.pop() as (...values: UnwrapSignals<SA>) => Single<R>;
    } else {
        options = {};
        asyncCall = lastParam as (...values: UnwrapSignals<SA>) => Single<R>;
    }

    const signals: SA = params as unknown as SA;

    let sourceValues$ = new ReplaySubject<UnwrapSignals<SA>>(1);
    let resultSignal: Signal<R | undefined> | undefined;
    const loading = signal(false);
    const error = signal<undefined | unknown>(undefined);
    const setLoading = (value: boolean) => setTimeout(() => loading.set(value)); // missing allowSignalWrites in computed options
    const setError = (e: unknown) => setTimeout(() => error.set(e)); // missing allowSignalWrites in computed options

    const result = computed(
        () => {
            let sourceValues = [];
            for (const signal of signals) {
                const sourceValue = signal();
                if (sourceValue === false || sourceValue === undefined) {
                    return resultSignal;
                }
                sourceValues.push(sourceValue as any);
            }
            sourceValues$.next(sourceValues as UnwrapSignals<SA>);

            if (!resultSignal) {
                resultSignal = toSignal(
                    sourceValues$.pipe(
                        switchMap((values: UnwrapSignals<SA>) => {
                            setLoading(true);
                            return asyncCall(...values)
                        }),
                        tap({
                            next: () => setLoading(false),
                            error: (e) => setError(e)
                        })
                    ),
                    { initialValue: options.initialValue, injector }
                );
            }
            return resultSignal();
        }
    ) as SignalResource<R>;
    result.loading = loading;
    result.error = error;

    return result;
}

function isSignalResourceOptions<T>(value: SignalResourceOptions<T> | Function): value is SignalResourceOptions<T> {
    return !(value instanceof Function);
}
