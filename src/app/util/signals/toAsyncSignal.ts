import { AsyncSignal, NOT_LOADED } from '@/util/signals/AsyncSignal';
import { SafeUnwrapAsyncSignals } from '@/util/signals/internal/SafeUnwrapAsyncSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { safeComputed } from '@/util/signals/safeComputed';
import { Tuple } from '@/util/types/Tuple';
import { assertInInjectionContext, assertNotInReactiveContext, inject, Injector, signal, Signal, untracked } from '@angular/core';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

declare const ngDevMode: boolean;

export type ToAsyncSignalOptions<U> = Pick<ToSignalOptions, 'injector'>;

export function toAsyncSignal<R>(asyncCall: () => Observable<R>, options: ToAsyncSignalOptions<R>): AsyncSignal<R>;
export function toAsyncSignal<R>(asyncCall: () => Observable<R>): AsyncSignal<R>;
export function toAsyncSignal<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Observable<R>, options: ToAsyncSignalOptions<R>): AsyncSignal<R>;
export function toAsyncSignal<S, R>(signal: Signal<S | undefined>, asyncCall: (value: S) => Observable<R>): AsyncSignal<R>;
export function toAsyncSignal<ST extends Tuple<Signal<any>>, R>(
	...params: [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => Observable<R>]
		| [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => Observable<R>, ToAsyncSignalOptions<R>]
): AsyncSignal<R>;


export function toAsyncSignal<ST extends Tuple<Signal<any>>, R>(
	...params: [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => Observable<R>]
		| [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => Observable<R>, ToAsyncSignalOptions<R>]
): AsyncSignal<R> {
	ngDevMode && assertNotInReactiveContext(toSignal);

	const { source, call, options} = splitParams<ST, (...values: SafeUnwrapAsyncSignals<ST>) => Observable<R>, ToAsyncSignalOptions<R>>(...params);
	!options?.injector && assertInInjectionContext(toAsyncSignal);
	const injector: Injector = options?.injector ?? inject(Injector);
	const destroy$ = new Subject<void>();
	const loading$ = signal(false);

	const wrappedResponseSignal: AsyncSignal<AsyncSignal<R>> = safeComputed(
		...source,
		(...values: SafeUnwrapAsyncSignals<ST>): AsyncSignal<R> => {
			destroy$.next();
			return untracked(() => {
				loading$.set(true);
				return toSignal(
					call(...values).pipe<R, R | NOT_LOADED>(
						tap(() => loading$.set(false)),
						takeUntil(destroy$)
					),
					{ injector, initialValue: NOT_LOADED }
				)
			});
		}
	);

	return safeComputed(
		wrappedResponseSignal,
		(responseSignal: AsyncSignal<R>) => responseSignal()
	) satisfies AsyncSignal<R>;
}
