import { Base } from '../../angular/Base';
import { Selector } from './Selector';

export function autoSubscribeAllSelectors(componentOrService: Base) {
    Object.getOwnPropertyNames(componentOrService).forEach((prop: string) => {
        if ((componentOrService as any)[prop] instanceof Selector) {
            ((componentOrService as any)[prop] as Selector<unknown>).autoSubscribe((componentOrService as any).destroy$);
        }
    })
}
