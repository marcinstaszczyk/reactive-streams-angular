import { WrappedValue } from '@/performance/core/WrappedValue';
import { Signal } from '@angular/core';

export abstract class ValueService {

    readonly value$!: Signal<WrappedValue | undefined>;

}
