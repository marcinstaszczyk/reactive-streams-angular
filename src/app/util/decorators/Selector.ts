import { Observable } from 'rxjs';
import { LastObservableValueLogger } from './LastObservableValueLogger';
import { ShareReplayPipe } from './ShareReplayPipe';
import { MemoizeNoArgs } from './MemoizeNoArgs';
import { NoArgsFunction } from './core/NoArgsFunction';

type SelectionFunction<T> = NoArgsFunction<Observable<T>>;

const SELECTOR_NAME = '@Selector';

export function Selector() {
    return <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<SelectionFunction<T>>): void => {
        LastObservableValueLogger(SELECTOR_NAME)(target, propertyKey, descriptor);
        ShareReplayPipe(SELECTOR_NAME)(target, propertyKey, descriptor);
        MemoizeNoArgs(SELECTOR_NAME)(target, propertyKey, descriptor);
    };
}
