import { WrappedValue } from '@/performance/core/WrappedValue';
import { WritableSignal } from '@angular/core';
import { ValueService } from './ValueService';

export class ValueServiceImpl extends ValueService {

    override value$!: WritableSignal<WrappedValue | undefined>;

}
