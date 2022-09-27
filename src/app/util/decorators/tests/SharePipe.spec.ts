import { ShareReplayPipe } from '../ShareReplayPipe';
import { Observable } from 'rxjs';

describe('ShareReplayPipe', () => {
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

    describe('BEHAVIOR:', () => {
        it('should return shareReplayed observable', () => {
            const returnedObservable: Observable<number> = object.decoratedMethod();

            returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });
            returnedObservable.subscribe((value) => {
                expect(value).toBe(1);
            });
        });
        it('should NOT cache method responses (Memoize decorators are for this)', () => {
            const observableFromFirstCall: Observable<number> = object.decoratedMethod();
            const observableFromSecondCall: Observable<number> = object.decoratedMethod();
            expect(observableFromFirstCall).not.toBe(observableFromSecondCall);

            observableFromSecondCall.subscribe((value) => {
                expect(value).toBe(1);
            });
            observableFromFirstCall.subscribe((value) => {
                expect(value).toBe(2);
            });
        });
    });

});

class TestClass<T> {

    constructor(
        private observable: Observable<T>
    ) {
    }

    @ShareReplayPipe()
    decoratedMethod(): Observable<T> {
        return this.observable;
    };

    // @ts-ignore TODO add tests to check compile error: https://github.com/SamVerschueren/tsd https://github.com/Microsoft/dtslint
    @ShareReplayPipe()
    memoizedMethodWithParams(value: T): T {
        return value;
    }

    // TODO add tests to check compile error: https://github.com/SamVerschueren/tsd https://github.com/Microsoft/dtslint
    // @ShareReplayPipe()
    param: T | undefined;

}
