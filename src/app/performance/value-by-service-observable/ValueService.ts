import { Observable } from 'rxjs';
import { WrappedValue } from '../core/WrappedValue';

export abstract class ValueService {

    readonly value$!: Observable<WrappedValue | undefined>;

}
