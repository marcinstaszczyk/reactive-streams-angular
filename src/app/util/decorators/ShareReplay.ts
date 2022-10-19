import { Observable, ReplaySubject, share } from 'rxjs';
import { NoArgsFunction } from './core/NoArgsFunction';

type SelectionFunction<T> = NoArgsFunction<Observable<T>>;

export function ShareReplay(
    decoratorName = '@ShareReplay',
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

            const originObservable: Observable<T> = originFunction.apply(this);
            const sharedObservable: Observable<T> = originObservable.pipe(
                share({
                    connector: () => new ReplaySubject<T>(1),
                    resetOnError: false, // TODO error handling
                    resetOnComplete: false, // selector should never complete
                    resetOnRefCountZero: true
                })
            );

            return sharedObservable;
        }
    };
}
