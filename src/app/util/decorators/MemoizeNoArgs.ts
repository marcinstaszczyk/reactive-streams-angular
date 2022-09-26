import { NoArgsFunction } from './core/NoArgsFunction';

export function MemoizeNoArgs<
    F extends NoArgsFunction<T>,
    T = ReturnType<F>
>(
    decoratorName = '@MemoizeNoArgs',
    mapPropertyName = Symbol(decoratorName)
) {
    return (target: Object, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<NoArgsFunction<T>>): void => {
        const originFunction: NoArgsFunction<T> | undefined = descriptor.value;
        if (!originFunction || !(originFunction instanceof Function)) {
            throw new Error(`${decoratorName} decorator must be used on method`);
        }

        descriptor.value = function (): T {
            if (!this.hasOwnProperty(mapPropertyName)) {
                Object.defineProperty(this, mapPropertyName, {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: new Map<PropertyKey, T>()
                });
            }
            const map: Map<PropertyKey, T> = (this as any)[mapPropertyName];

            if (!map.has(propertyKey)) {
                if (arguments.length > 0) {
                    throw Error(`${decoratorName} decorator should not be used on method with parameters`);
                }

                const returnedFromOrigin: T = originFunction.apply(this);

                map.set(propertyKey, returnedFromOrigin);
            }

            return map.get(propertyKey)!;
        }
    };
}
