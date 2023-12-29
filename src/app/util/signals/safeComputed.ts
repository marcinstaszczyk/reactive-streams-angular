import { AsyncSignal, NOT_LOADED } from '@/util/signals/AsyncSignal';
import { SafeUnwrapAsyncSignals } from '@/util/signals/internal/SafeUnwrapAsyncSignals';
import { splitParams } from '@/util/signals/internal/splitParams';
import { Tuple } from '@/util/types/Tuple';
import { computed, CreateComputedOptions } from '@angular/core';

export function safeComputed<A, R>(
    s1: AsyncSignal<A>,
    map: (a: A) => R,
    options: CreateComputedOptions<R>
): AsyncSignal<R>;
export function safeComputed<A, R>(
    s1: AsyncSignal<A>,
    map: (a: A) => R
): AsyncSignal<R>;
export function safeComputed<A, B, R>(
    s1: AsyncSignal<A>,
    s2: AsyncSignal<B>,
    map: (a: A, b: B) => R,
    options: CreateComputedOptions<R>
): AsyncSignal<R>;
export function safeComputed<A, B, R>(
    s1: AsyncSignal<A>,
    s2: AsyncSignal<B>,
    map: (a: A, b: B) => R
): AsyncSignal<R>;
export function safeComputed<A, B, C, R>(
    s1: AsyncSignal<A>,
    s2: AsyncSignal<B>,
    s3: AsyncSignal<C>,
    map: (a: A, b: B, c: C) => R,
    options: CreateComputedOptions<R>
): AsyncSignal<R>;
export function safeComputed<A, B, C, R>(
    s1: AsyncSignal<A>,
    s2: AsyncSignal<B>,
    s3: AsyncSignal<C>,
    map: (a: A, b: B, c: C) => R
): AsyncSignal<R>;
export function safeComputed<ST extends Tuple<AsyncSignal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R]
             | [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R, CreateComputedOptions<R>]
): AsyncSignal<R>;


export function safeComputed<ST extends Tuple<AsyncSignal<any>>, R>(
    ...params: [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R]
             | [...ST, (...values: SafeUnwrapAsyncSignals<ST>) => R, CreateComputedOptions<R>]
): AsyncSignal<R> {
    const { source, call, options} = splitParams<Tuple<AsyncSignal<any>>, Function, CreateComputedOptions<R>>(...params);

    return computed(() => {
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
}
