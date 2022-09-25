import { Observable, ReplaySubject, share } from 'rxjs';

type SelectionFunction<T> = () => Observable<T>;
type SelectionData<T> = [subject: ReplaySubject<T> | null, memoizedObservable: Observable<T>];

const selectorMapSymbol = Symbol('@Selector()');

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
            const map: Map<PropertyKey, SelectionData<T>> = (this as any)[selectorMapSymbol];

            if (!map.has(propertyKey)) {
                if (arguments.length > 0) {
                    throw Error('should not be used on function with parameters');
                }

                const selectionData: SelectionData<T> = [
                    null,
                    originFunction.apply(this).pipe(
                        share({
                            connector: () => {
                                const replaySubject = new ReplaySubject<T>(1);
                                selectionData[0] = replaySubject;
                                return replaySubject;
                            },
                            resetOnError: false, // TODO error handling
                            resetOnComplete: false, // selector should never complete
                            resetOnRefCountZero: true
                        })
                    )
                ];

                map.set(propertyKey, selectionData);
            }

            return map.get(propertyKey)![1];
        }
    };
}
