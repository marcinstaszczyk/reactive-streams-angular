import { Observable, ReplaySubject, share, tap } from 'rxjs';

type SelectionFunction<T> = () => Observable<T>;

const selectorMapSymbol = Symbol('@Selector');

export function Selector() {
    return <T>(target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<SelectionFunction<T>>): void => {
        const originFunction: SelectionFunction<T> | undefined = descriptor.value;
        if (!originFunction || !(originFunction instanceof Function)) {
            throw new Error('@Selector() decorator must be used on method');
        }

        descriptor.value = function (): Observable<T> {
            if (!this.hasOwnProperty(selectorMapSymbol)) {
                Object.defineProperty(this, selectorMapSymbol, {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: new Map<PropertyKey, Observable<unknown>>()
                });
            }
            const map: Map<PropertyKey, Observable<T>> = (this as any)[selectorMapSymbol];

            if (!map.has(propertyKey)) {
                if (arguments.length > 0) {
                    throw Error('@Selector() decorator should not be used on function with parameters');
                }

                let logProperty: string | null = `${propertyKey.toString()} - last value`;
                if (!this.hasOwnProperty(logProperty)) {
                    Object.defineProperty(this, logProperty, {
                        configurable: false,
                        enumerable: false,
                        writable: true,
                        value: null
                    });
                } else {
                    logProperty = null;
                }

                const originObservable: Observable<T> = originFunction.apply(this);
                const loggedObservable: Observable<T> = logProperty // TODO condition for logging
                    ? originObservable.pipe(
                        tap((value: T) => {
                            (this as any)[logProperty!] = value;
                        })
                    )
                    : originObservable;
                const sharedObservable: Observable<T> = loggedObservable.pipe(
                    share({
                        connector: () => new ReplaySubject<T>(1),
                        resetOnError: false, // TODO error handling
                        resetOnComplete: false, // selector should never complete
                        resetOnRefCountZero: true
                    })
                );

                map.set(propertyKey, sharedObservable);
            }

            return map.get(propertyKey)!;
        }
    };
}
