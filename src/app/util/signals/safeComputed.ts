import { AsyncSignal, AsyncSignalState, NOT_LOADED } from '@/util/signals/AsyncSignal';
import { SafeUnwrapAsyncSignals } from '@/util/signals/internal/SafeUnwrapAsyncSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { Tuple } from '@/util/types/Tuple';
import { computed, CreateComputedOptions, Signal, untracked } from '@angular/core';

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
    const { source, call, options} = splitParams<Tuple<AsyncSignal<any>>, Function, CreateComputedOptions<R>>(...params);

	const result$: Signal<R | NOT_LOADED> = computed(() => {
		const values = [];
		for (const signal of source) {
			const value = signal();
			if (value === NOT_LOADED) {
				return NOT_LOADED;
			}
			values.push(value);
		}
		return call(...values);
	}, options);

	let lastState: Map<Signal<any>, any> | undefined;
	const state$ = computed(() => {
		const value = result$(); // triggers re-computation on value change
		if (value !== NOT_LOADED) {
			untracked(() => {
				lastState = new Map();
				lastState.set(result$, value);
				for (const signal of source) {
					signal.state$()?.forEach((value, key) => lastState!.set(key, value));
				}
			});
		}
		return lastState;
	})

	return Object.assign(result$, {
		state$,
		valueForState: (state: AsyncSignalState): Exclude<R, NOT_LOADED> => {
			if (!state?.has(result$)) {
				throw new Error('AsyncSignalState do not contains value for the AsyncSignal');
			}
			return state?.get(result$) as Exclude<R, NOT_LOADED>;
		}
	});
}
