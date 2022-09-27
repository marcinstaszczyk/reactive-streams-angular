import { Observable, tap } from 'rxjs';
import { NoArgsFunction } from './core/NoArgsFunction';

type SelectionFunction<T> = NoArgsFunction<Observable<T>>;

export function LastObservableValueLogger(
    decoratorName = '@LastObservableValueLogger',
) {
    return <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<SelectionFunction<T>>): void => {
        const originFunction: SelectionFunction<T> | undefined = descriptor.value;
        if (!originFunction || !(originFunction instanceof Function)) {
            throw new Error(`${decoratorName} decorator must be used on method`);
        }

        descriptor.value = function (): Observable<T> {
            if (arguments.length > 0) {
                console.warn(`${decoratorName} decorator should not be used on method with parameters`);
            }

            let logProperty: string | null = `${propertyKey.toString()} - last value`;
            if (!this.hasOwnProperty(logProperty)) {
                Object.defineProperty(this, logProperty, {
                    configurable: false,
                    enumerable: false,
                    writable: true,
                    value: null
                });
            }

            const originObservable: Observable<T> = originFunction.apply(this);
            const loggedObservable: Observable<T> = logProperty // TODO condition for logging
                ? originObservable.pipe(
                    tap((value: T) => {
                        // TODO Chrome plugin to check values
                        console.log('LastObservableValueLogger', this.constructor.name, value);
                        (this as any)[logProperty!] = value;
                    })
                )
                : originObservable;

            return loggedObservable;
        }
    };
}
