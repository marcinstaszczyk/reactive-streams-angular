import { splitParams } from '@/util/signals/internal/splitParams';
import { Tuple } from '@/util/types/Tuple';
import { computed, CreateComputedOptions, Signal } from '@angular/core';

export function safeComputed<A, R>(
    s1: Signal<A | undefined>,
    map: (a: A) => R,
    options?: CreateComputedOptions<R>
): Signal<R | undefined>;
export function safeComputed<A, B, R>(
    s1: Signal<A | undefined>,
    s2: Signal<B | undefined>,
    map: (a: A, b: B) => R,
    options?: CreateComputedOptions<R>
): Signal<R | undefined>;
export function safeComputed<A, B, C, R>(
    s1: Signal<A | undefined>,
    s2: Signal<B | undefined>,
    s3: Signal<C | undefined>,
    map: (a: A, b: B, c: C) => R,
    options?: CreateComputedOptions<R>
): Signal<R | undefined>;
export function safeComputed<A, B, C, D, R>(
    s1: Signal<A | undefined>,
    s2: Signal<B | undefined>,
    s3: Signal<C | undefined>,
    s4: Signal<D | undefined>,
    map: (a: A, b: B, c: C, d: D) => R,
    options?: CreateComputedOptions<R>
): Signal<R | undefined>;
export function safeComputed<R>(...params: unknown[]): Signal<R | undefined> {
    const { source, call, options} = splitParams<Tuple<Signal<any>>, Function, CreateComputedOptions<R>>(params);

    return computed(() => {
        const values = [];
        for (const signal of source) {
            const value = signal();
            if (value === undefined) {
                return undefined;
            }
            values.push(value);
        }
        return call(...values);
    }, options);
}
