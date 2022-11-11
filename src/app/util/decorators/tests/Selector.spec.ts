import { Observable, ReplaySubject, Subscription, tap } from 'rxjs';
import { Selector } from '../Selector';
import { findPropertyStartingWith, getValueOfPropertyStartingWith } from './LastObservableValueLogger.spec';

describe('@Selector() decorator', () => {
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

    describe('should return one shareReplay observable', () => {
        it('same observable on consecutive calls', () => {
            const firstObservable: Observable<number> = object.decoratedMethod();
            const secondObservable: Observable<number> = object.decoratedMethod();
            expect(firstObservable).toEqual(secondObservable);
        });

        it('observable sharing values between subscriptions and replaying last value', () => {
            const returnedObservable: Observable<number> = object.decoratedMethod();

            returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });
            returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });
        });
    });

    describe('should return lazy observable (see rxjs/refCount)', () => {
        let subject: ReplaySubject<number>;
        let lastComputedValue: number | undefined;

        beforeEach(() => {
            subject = new ReplaySubject<number>(1);
            lastComputedValue = undefined;
            object = new TestClass(subject.asObservable().pipe(
                tap((value) => {
                    lastComputedValue = value;
                })
            ));
        });

        it('should not do computations if not subscribed to', () => {
            const _returnedObservable: Observable<number> = object.decoratedMethod();

            subject.next(1);

            expect(lastComputedValue).toBe(undefined);
        });

        it('when underlying observable is a replaying observable, should do postponed computations when subscribed to', () => {
            const returnedObservable: Observable<number> = object.decoratedMethod();

            subject.next(1);

            returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });

            expect(lastComputedValue).toBe(1);
        });

        it('should not do computations if unsubscribed from', () => {
            const returnedObservable: Observable<number> = object.decoratedMethod();
            subject.next(1);

            const subscription: Subscription = returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });

            subscription.unsubscribe();

            subject.next(2);

            expect(lastComputedValue).toBe(1);
        });
    });

    describe('should enable checking of last emitted value', () => {
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

        it('should store last value passed into created property', () => {
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
        it('should not allow usage on methods with params', () => {
            expect(() => object.decoratedMethodWithParams(1)).toThrowError();
        });
    });

});

class TestClass<T> {

    constructor(
        private observable: Observable<T>
    ) {
    }

    @Selector()
    decoratedMethod(): Observable<T> {
        return this.observable;
    };

    // @ts-ignore TODO add tests to check compile error: https://github.com/SamVerschueren/tsd https://github.com/Microsoft/dtslint
    @Selector()
    decoratedMethodWithParams(value: T): T {
        return value;
    }

}
