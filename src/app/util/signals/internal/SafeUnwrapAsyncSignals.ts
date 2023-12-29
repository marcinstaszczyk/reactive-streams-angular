import { NOT_LOADED } from '@/util/signals/AsyncSignal';
import { Tuple } from '@/util/types/Tuple';
import { Signal } from '@angular/core';
import { UnwrapSignals } from './UnwrapSignals';

export type SafeUnwrapAsyncSignals<ST extends Tuple<Signal<any>>> = UnwrapSignals<ST, NOT_LOADED>;
