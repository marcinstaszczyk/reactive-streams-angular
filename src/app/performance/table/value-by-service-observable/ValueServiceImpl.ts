import { WrappedValue } from '@/performance/core/WrappedValue';
import { Observable } from 'rxjs';
import { ValueService } from './ValueService';

export class ValueServiceImpl extends ValueService {

    override value$!: Observable<WrappedValue | undefined>;

}
