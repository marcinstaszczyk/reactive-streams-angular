import { computed, Signal } from '@angular/core';

export function safeComputed<A, R>(s1: Signal<A | undefined>, map: (a: A) => R): Signal<R | undefined>;
export function safeComputed<A, B, R>(s1: Signal<A | undefined>, s2: Signal<B | undefined>, map: (a: A, b: B) => R): Signal<R | undefined>;
export function safeComputed<A, B, C, R>(s1: Signal<A | undefined>, s2: Signal<B | undefined>, s3: Signal<C | undefined>, map: (a: A, b: B, c: C) => R): Signal<R | undefined>;
export function safeComputed<A, B, C, D, R>(
    s1: Signal<A | undefined>,
    s2: Signal<B | undefined>,
    s3: Signal<C | undefined>,
    s4: Signal<D | undefined>,
    map: (a: A, b: B, c: C, d: D) => R
): Signal<R | undefined>;
export function safeComputed(...params: unknown[]): Signal<any> {
    const map = params.pop() as Function;
    const signals = params as Array<Signal<any>>;

    return computed(() => {
        const values = [];
        for (const argument of signals) {
            const value = argument();
            if (value === undefined) {
                return undefined;
            }
            values.push(value);
        }
        return map(...values);
    });
}
