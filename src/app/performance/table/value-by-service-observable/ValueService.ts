import { WrappedValue } from '@/performance/core/WrappedValue';
import { Observable } from 'rxjs';

export abstract class ValueService {

    readonly value$!: Observable<WrappedValue | undefined>;

}
