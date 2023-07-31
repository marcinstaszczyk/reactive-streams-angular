import { Single } from '@/util';
import { computed, inject, Injector, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

export interface SignalResource<T> extends Signal<T> {
    // TOOD do we need this? ready: Signal<boolean>; // call will activate request
    loading: Signal<boolean>; // call will NOT activate request
    error: Signal<undefined | unknown>; // call will NOT activate request (TODO confirm)
}

export function signalResource<T>(
    fetcher: () => Single<T>,
    options: { initialValue: T }
): SignalResource<T>;
export function signalResource<T, S>(
    source: Signal<S | undefined | false>,
    fetcher: (value: S) => Single<T>,
    options: { initialValue: T }
): SignalResource<T>;
export function signalResource<T>(
    fetcher: () => Single<T>,
    options?: { initialValue: T }
): SignalResource<T | undefined>;
export function signalResource<T, S>(
    source: Signal<S | undefined | false>,
    fetcher: (value: S) => Single<T>,
    options?: { initialValue: T }
): SignalResource<T | undefined>;

export function signalResource<T, S = true>(
    sourceOrFetcher: Signal<S> | (() => Single<T>),
    fetcherOrOptions?: ((value: S) => Single<T>) | { initialValue: T },
    options?: { initialValue: T }
): SignalResource<T | undefined> {
    const injector = inject(Injector);
    // TODO how to use SIGNAL symbol to precisely detect Signal?
    const source: Signal<S | null | false> | undefined =
        fetcherOrOptions instanceof Function
            ? sourceOrFetcher as Signal<S>
            : undefined;
    const fetcher: (value: S) => Single<T> =
        fetcherOrOptions instanceof Function
            ? fetcherOrOptions
            : sourceOrFetcher as () => Single<T>;

    let initialValue = options?.initialValue ?? ((fetcherOrOptions instanceof Function) ? undefined : fetcherOrOptions?.initialValue)
    let sourceValue: S;
    let eagerSignal: Signal<T | undefined> | undefined;
    const loading = signal(false);
    const setLoading = (value: boolean) => setTimeout(() => loading.set(value)); // missing allowSignalWrites in computed options
    const error = signal<undefined | unknown>(undefined);
    const setError = (e: unknown) => setTimeout(() => error.set(e)); // missing allowSignalWrites in computed options

    const result = computed(
        () => {
            let value: any = undefined;
            if (source) {
                value = source();
                if (value === false || value === undefined) {
                    return undefined;
                }
                if (value !== sourceValue) {
                    eagerSignal = undefined;
                }
            }
            if (!eagerSignal) {
                setLoading(true);
                const Single = fetcher(value as S).pipe(
                    tap({
                        next: (value) => {
                            initialValue = value;
                            setLoading(false);

                        },
                        error: (e: unknown) => setError(e),
                        complete: () => setLoading(false)
                    })
                );
                eagerSignal = toSignal(Single, { initialValue, injector });
            }
            return eagerSignal();
        }
    ) as SignalResource<T>;
    result.loading = loading;
    result.error = error;

    return result;
}
