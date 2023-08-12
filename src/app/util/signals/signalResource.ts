import { Single } from '@/util';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { computed, inject, Injector, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { mergeWith, ReplaySubject, startWith, Subject, switchMap, tap } from 'rxjs';

export type SignalResource<T> = Exclude<WritableSignal<T>, 'mutate'>
    & AsyncSignal<T>
    & {
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

const NOT_LOADED = Symbol('NOT_LOADED');

export function signalResource<R>(asyncCall: () => Single<R>, options: SignalResourceOptions<R>): SignalResource<R>;
export function signalResource<R>(asyncCall: () => Single<R>): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>, options: SignalResourceOptions<R>): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Single<R>): SignalResource<R>;
export function signalResource<SA extends Tuple<Signal<any>>, R>(
    ...params: [...SA, (...values: UnwrapSignals<SA>) => Single<R>]
             | [...SA, (...values: UnwrapSignals<SA>) => Single<R>, SignalResourceOptions<R>]
): SignalResource<R>;
export function signalResource<SA extends Tuple<Signal<any>>, R>(
    ...params: [...SA, (...values: UnwrapSignals<SA>) => Single<R>]
             | [...SA, (...values: UnwrapSignals<SA>) => Single<R>, SignalResourceOptions<R>]
): SignalResource<R> {
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

    // TODO almost like safeComputed. How to use it
    const sourceValues = computed(() => {
        const sourceValues = [];
        for (const signal of signals) {
            if (isSignalResource(signal) && !signal.ready()) {
                return undefined;
            }

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

    let sourceValuesSubject$ = new ReplaySubject<UnwrapSignals<SA>>(1);
    let signalFromObservable: Signal<R | typeof NOT_LOADED> | undefined;
    const loading = signal(false);
    const error = signal<undefined | unknown>(undefined);

    let lastValues: UnwrapSignals<SA> | undefined;
    const resultSubject$ = new Subject<R>();

    const baseResult = computed(
        () => {
            const values: UnwrapSignals<SA> | undefined = sourceValues();
            if (!values || values === lastValues) {
                return signalFromObservable?.();
            }

            lastValues = values;
            sourceValuesSubject$.next(values);

            if (!signalFromObservable) {
                signalFromObservable = toSignal(
                    sourceValuesSubject$.pipe(
                        switchMap((values: UnwrapSignals<SA>) => {
                            untracked(() => loading.set(true));
                            return asyncCall(...values)
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
            if (options.initialValue) {
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

function isSignalResourceOptions<T>(value: SignalResourceOptions<T> | Function): value is SignalResourceOptions<T> {
    return !(value instanceof Function);
}

function isSignalResource<T>(signal: Signal<T> | SignalResource<T>): signal is SignalResource<T> {
    return !!(signal as SignalResource<T>).ready;
}
