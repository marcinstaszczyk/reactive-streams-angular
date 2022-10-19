import { Observable } from 'rxjs';
import { NoArgsFunction } from './core/NoArgsFunction';
import { DistinctUntilChanged } from './DistinctUntilChanged';
import { LastObservableValueLogger } from './LastObservableValueLogger';
import { MemoizeNoArgs } from './MemoizeNoArgs';
import { ShareReplay } from './ShareReplay';

type SelectionFunction<T> = NoArgsFunction<Observable<T>>;

const SELECTOR_NAME = '@Selector';

export function Selector() {
    return <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<SelectionFunction<T>>): void => {
        LastObservableValueLogger(SELECTOR_NAME)(target, propertyKey, descriptor);
        DistinctUntilChanged(SELECTOR_NAME)(target, propertyKey, descriptor);
        ShareReplay(SELECTOR_NAME)(target, propertyKey, descriptor);
        MemoizeNoArgs(SELECTOR_NAME)(target, propertyKey, descriptor);
    };
}
