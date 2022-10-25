import { Base } from '../../angular/Base';
import { Selector } from './Selector';

export function autoSubscribeAllSelectors(componentOrService: Base) {
    Object.getOwnPropertyNames(componentOrService).forEach((prop: string) => {
        const fieldValue: unknown = (componentOrService as any)[prop];
        if (fieldValue instanceof Selector) {
            fieldValue.autoSubscribe(
                (componentOrService as any).destroy$,
                (value: unknown) => {
                    (componentOrService as any)['_last_value_' + prop] = value;
                }
            );
        }
    })
}
