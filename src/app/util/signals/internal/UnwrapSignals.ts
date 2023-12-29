import { Tuple } from '@/util/types/Tuple';
import { Signal } from '@angular/core';

export type UnwrapSignals<ST extends Tuple<Signal<any>>, ExcludeType = never> =
    ST extends never[] ? never[] :
    ST extends [Signal<infer P>, ...infer Tail extends Tuple<Signal<unknown>>]
        ? [Exclude<P, ExcludeType>, ...UnwrapSignals<Tail, ExcludeType>]
        : never;
