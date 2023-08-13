import { Tuple } from '@/util/types/Tuple';
import { Signal } from '@angular/core';
import { UnwrapSignals } from './UnwrapSignals';

export type SafeUnwrapSignals<ST extends Tuple<Signal<any>>> = UnwrapSignals<ST, undefined>;
