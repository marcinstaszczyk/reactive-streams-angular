import { AsyncSignal, AsyncSignalContext, NOT_LOADED } from '@/util/signals/AsyncSignal';
import { AsyncSignalContextImpl } from '@/util/signals/internal/AsyncSignalContextImpl';
import { SafeUnwrapAsyncSignals } from '@/util/signals/internal/SafeUnwrapAsyncSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { Tuple } from '@/util/types/Tuple';
import { computed, CreateComputedOptions, signal, Signal, untracked } from '@angular/core';

export function safeComputed<A, R>(
    s1: Signal<A | NOT_LOADED>,
    map: (a: A) => R,
    options: CreateComputedOptions<R>
): AsyncSignal<R>;
export function safeComputed<A, R>(
    s1: Signal<A | NOT_LOADED>,
    map: (a: A) => R
): AsyncSignal<R>;
export function safeComputed<A, B, R>(
    s1: Signal<A | NOT_LOADED>,
    s2: Signal<B | NOT_LOADED>,
    map: (a: A, b: B) => R,
    options: CreateComputedOptions<R>
): AsyncSignal<R>;
export function safeComputed<A, B, R>(
    s1: Signal<A | NOT_LOADED>,
    s2: Signal<B | NOT_LOADED>,
    map: (a: A, b: B) => R
): AsyncSignal<R>;
export function safeComputed<A, B, C, R>(
    s1: Signal<A | NOT_LOADED>,
    s2: Signal<B | NOT_LOADED>,
    s3: Signal<C | NOT_LOADED>,
    map: (a: A, b: B, c: C) => R,
    options: CreateComputedOptions<R>
): AsyncSignal<R>;
export function safeComputed<A, B, C, R>(
    s1: Signal<A | NOT_LOADED>,
    s2: Signal<B | NOT_LOADED>,
    s3: Signal<C | NOT_LOADED>,
    map: (a: A, b: B, c: C) => R
): AsyncSignal<R>;
export function safeComputed<ST extends Tuple<Signal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R]
             | [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R, CreateComputedOptions<R>]
): AsyncSignal<R>;


export function safeComputed<ST extends Tuple<Signal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R]
             | [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R, CreateComputedOptions<R>]
): AsyncSignal<R> {
    const { source, call, options} = splitParams<Tuple<Signal<any>>, Function, CreateComputedOptions<R>>(...params);

	const context$ = signal<AsyncSignalContext>(EMPTY_AsyncSignalContext);
	const loading$ = signal<boolean>(false);

	const result$: Signal<R | NOT_LOADED> = computed(() => {
		const values = [];
		for (const signal of source) {
			const value = signal();
			if (value === NOT_LOADED) {
				untracked(() => loading$.set(true));
				return NOT_LOADED;
			}
			values.push(value);
		}
		const result = call(...values);

		untracked(() => {
			loading$.set(result === NOT_LOADED);

			context$.set(new AsyncSignalContextImpl(
				result,
				result$,
				source.map((signal$) => (signal$ as AsyncSignal<any>).context$?.() ?? EMPTY_AsyncSignalContext)
			));
		});

		return result;
	}, options);

	return Object.assign(result$, {
		context$,
		loading$
	});
}

const EMPTY_AsyncSignalContext: AsyncSignalContext = { get: () => undefined };
