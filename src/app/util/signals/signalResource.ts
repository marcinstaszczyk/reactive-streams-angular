import { Single } from '@/util';
import { computed, inject, Injector, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { mergeWith, ReplaySubject, Subject, switchMap, tap } from 'rxjs';

export interface SignalResource<T> extends WritableSignal<T> {
    // TOOD do we need this? ready: Signal<boolean>; // call will activate request
    loading: Signal<boolean>; // call will NOT activate request
    error: Signal<undefined | unknown>; // call will NOT activate request (TODO confirm)
}

type Tuple<T> = readonly T[];

type SignalResourceOptions<T> = { initialValue?: T };

type UnwrapSignals<SA extends Tuple<Signal<any>>> =
    SA extends never[] ? never[] :
    SA extends [Signal<infer P>, ...infer Tail extends Tuple<Signal<unknown>>]
        ? [Exclude<P, undefined>, ...UnwrapSignals<Tail>] // TODO do we need undefined | false | null? Then we cannot use safeComputed()
        : never;

export function signalResource<R>(asyncCall: () => Single<R>, options: SignalResourceOptions<R> & { initialValue: R }): SignalResource<R>;
export function signalResource<R>(asyncCall: () => Single<R>, options: SignalResourceOptions<R>): SignalResource<R | undefined>;
export function signalResource<R>(asyncCall: () => Single<R>): SignalResource<R | undefined>;

export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>, options: SignalResourceOptions<R> & { initialValue: R }): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>, options: SignalResourceOptions<R>): SignalResource<R | undefined>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>): SignalResource<R | undefined>;

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

    // TODO almost like safeComputed. How to use it
    const sourceValues = computed(() => {
        const sourceValues = [];
        for (const signal of signals) {
            const sourceValue = signal();
            if (sourceValue === false || sourceValue === undefined) {
                return undefined;
            }
            sourceValues.push(sourceValue as any);
        }
        return sourceValues as UnwrapSignals<SA>;
    }, {
        equal: (a: any[] | undefined, b: any[] | undefined): boolean => {
            a = a ?? [];
            b = b ?? [];
            for(let i = 0; i < a.length; ++i) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        }
    });

    let lastValues: UnwrapSignals<SA> | undefined;
    const resultSubject$ = new Subject<R>();

    const result = computed(
        () => {
            const values: UnwrapSignals<SA> | undefined = sourceValues();
            if (!values || values === lastValues) {
                return resultSignal?.();
            }

            lastValues = values;
            sourceValues$.next(values);

            if (!resultSignal) {
                resultSignal = toSignal(
                    sourceValues$.pipe(
                        switchMap((values: UnwrapSignals<SA>) => {
                            untracked(() => loading.set(true));
                            return asyncCall(...values)
                        }),
                        tap({
                            next: () => untracked(() => loading.set(false)),
                            error: (e) => untracked(() => error.set(e))
                        }),
                        mergeWith(resultSubject$)
                    ),
                    { initialValue: options.initialValue, injector }
                );
            }
            return resultSignal();
        }
    ) as SignalResource<R>;

    return Object.assign(result, {
        set: (value: R) => resultSubject$.next(value),
        update: (updateFn: (value: R) => R) => resultSubject$.next(updateFn(result())),
        mutate: (mutateFn: (value: R) => void) => {
            mutateFn(result());
            resultSubject$.next(result());
        },
        asReadonly: () => result,
        loading,
        error
    })
}

function isSignalResourceOptions<T>(value: SignalResourceOptions<T> | Function): value is SignalResourceOptions<T> {
    return !(value instanceof Function);
}
