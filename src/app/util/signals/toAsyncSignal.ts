import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { SafeUnwrapSignals } from '@/util/signals/internal/SafeUnwrapSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { safeComputed } from '@/util/signals/safeComputed';
import { Tuple } from '@/util/types/Tuple';
import { assertInInjectionContext, assertNotInReactiveContext, inject, Injector, signal, Signal, untracked } from '@angular/core';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

declare const ngDevMode: boolean;

export type SignalResource<T> =
	AsyncSignal<T>
    & {
        loading$: Signal<boolean>; // call will NOT activate request
    };

export type SignalResourceOptions<U> = Pick<ToSignalOptions, 'injector' | 'initialValue'> & {
	initialValue?: U;
};

export function signalResource<R>(asyncCall: () => Observable<R>, options: SignalResourceOptions<R>): SignalResource<R>;
export function signalResource<R>(asyncCall: () => Observable<R>): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Observable<R>, options: SignalResourceOptions<R>): SignalResource<R>;
export function signalResource<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Observable<R>): SignalResource<R>;
export function signalResource<ST extends Tuple<Signal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapSignals<ST>) => Observable<R>]
             | [...ST, (...values: SafeUnwrapSignals<ST>) => Observable<R>, SignalResourceOptions<R>]
): SignalResource<R>;


export function signalResource<ST extends Tuple<Signal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapSignals<ST>) => Observable<R>]
             | [...ST, (...values: SafeUnwrapSignals<ST>) => Observable<R>, SignalResourceOptions<R>]
): SignalResource<R> {
	ngDevMode && assertNotInReactiveContext(toSignal);

    const { source, call, options} = splitParams<ST, (...values: SafeUnwrapSignals<ST>) => Observable<R>, SignalResourceOptions<R>>(...params);
	!options?.injector && assertInInjectionContext(signalResource);
	const injector: Injector = options?.injector ?? inject(Injector);
	const destroy$ = new Subject<void>();
	const loading$ = signal(false);

	const wrappedResponseSignal: Signal<Signal<R | undefined> | undefined> = safeComputed(
		...source,
		(...values: SafeUnwrapSignals<ST>): Signal<R | undefined> => {
			destroy$.next();
			return untracked(() => {
				loading$.set(true);
				return toSignal(
					call(...values).pipe(
						tap(() => loading$.set(false)),
						takeUntil(destroy$)
					),
					{ initialValue: options?.initialValue as R, injector }
				)
			});
		}
	);

	const responseSignal: Signal<R | undefined> = safeComputed(wrappedResponseSignal, (responseSignal: Signal<R | undefined>) => responseSignal());

	return Object.assign(responseSignal, {
		loading$
	})
}
