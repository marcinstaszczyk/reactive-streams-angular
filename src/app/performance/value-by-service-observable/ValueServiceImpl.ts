import { Observable } from 'rxjs';
import { WrappedValue } from '../core/WrappedValue';
import { ValueService } from './ValueService';

export class ValueServiceImpl extends ValueService {

    override value$!: Observable<WrappedValue | undefined>;

}
