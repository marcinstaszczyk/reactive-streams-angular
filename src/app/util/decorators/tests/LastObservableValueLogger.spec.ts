import { Observable } from 'rxjs';
import { LastObservableValueLogger } from '../LastObservableValueLogger';

describe('@LastObservableValueLogger() decorator', () => {
    let nextNumber: number;
    let observable: Observable<number>;
    let object: TestClass<number>;

    beforeEach(() => {
        nextNumber = 1;
        observable = new Observable(subscriber => {
            subscriber.next(nextNumber++);
            subscriber.complete();
        });
        object = new TestClass(observable);
    });

    it('should create additional property (in the object) similarly named to method name', () => {
        const _returnedObservable: Observable<number> = object.decoratedMethod();

        expect(findPropertyStartingWith(object, 'decoratedMethod')).toBeTruthy();
    });

    it('should store value passed from Observable into created property', () => {
        object.decoratedMethod().subscribe((value) => {
            expect(value).toBe(1);
        });

        expect(getValueOfPropertyStartingWith(object, 'decoratedMethod')).toBe(1);
    });

    describe('should store last value passed', () => {
        it('two method calls', () => {
            object.decoratedMethod().subscribe((value) => {
                expect(value).toBe(1);
            });
            object.decoratedMethod().subscribe((value) => {
                expect(value).toBe(2);
            });

            expect(getValueOfPropertyStartingWith(object, 'decoratedMethod')).toBe(2);
        });

        it('two subscriptions', () => {
            const returnedObservable: Observable<number> = object.decoratedMethod();
            returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });
            returnedObservable.subscribe((value) => {
                expect(value).toBe(2);
            });

            expect(getValueOfPropertyStartingWith(object, 'decoratedMethod')).toBe(2);
        });

        it('two values from observable', () => {
            observable = new Observable(subscriber => {
                subscriber.next(nextNumber++);
                subscriber.next(nextNumber++);
                subscriber.complete();
            });
            object = new TestClass(observable);

            const returnedObservable: Observable<number> = object.decoratedMethod();
            returnedObservable.subscribe((_value) => {});

            expect(getValueOfPropertyStartingWith(object, 'decoratedMethod')).toBe(2);
        });
    });

    describe('EDGE CASES:', () => {
        it('nothing should be logged before subscription', () => {
            const _returnedObservable: Observable<number> = object.decoratedMethod();

            expect(getValueOfPropertyStartingWith(object, 'decoratedMethod')).toBe(null);
        });
    });

});

export function findPropertyStartingWith(object: Object, propertyName: string): string | undefined {
    return Object.getOwnPropertyNames(object).find((prop: string) => prop.startsWith(propertyName));
}

export function getValueOfPropertyStartingWith(object: Object, propertyName: string): unknown | null | undefined {
    const prefixMatchingProperty: string | undefined = findPropertyStartingWith(object, propertyName);

    if (prefixMatchingProperty) {
        return (object as any)[prefixMatchingProperty];
    } else {
        return null;
    }
}

class TestClass<T> {

    constructor(
        private observable: Observable<T>
    ) {
    }

    @LastObservableValueLogger()
    decoratedMethod(): Observable<T> {
        return this.observable;
    };

}
