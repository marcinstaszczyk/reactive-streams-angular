import { MemoizeNoArgs } from '../MemoizeNoArgs';

describe('@MemoizeNoArgs() decorator', () => {
    let object: TestClass<number>;

    beforeEach(() => {
        object = new TestClass([1, 2, 3]);
    });

    it('should return same value on consecutive calls', () => {
        expect(object.memoizedMethod()).toBe(1);
        expect(object.memoizedMethod()).toBe(1);
    });
    it('should work separately for each method', () => {
        expect(object.memoizedMethod()).toBe(1);
        expect(object.memoizedMethod()).toBe(1);
        expect(object.memoizedMethod2()).toBe(2);
        expect(object.memoizedMethod2()).toBe(2);
    });

    describe('EDGE CASES:', () => {
        it('should not affect methods if not applied', () => {
            expect(object.memoizedMethod()).toBe(1);
            expect(object.memoizedMethod()).toBe(1);
            expect(object.method()).toBe(2);
            expect(object.method()).toBe(3);
        });

        it('should not allow usage on methods with params', () => {
            expect(() => object.memoizedMethodWithParams(1)).toThrowError();
        });
    });


});

class TestClass<T> {
    private index = 0;

    constructor(
        private values: T[]
    ) {
    }

    method(): T {
        return this.values[this.index++]!;
    };

    @MemoizeNoArgs()
    memoizedMethod(): T {
        return this.values[this.index++]!;
    };

    @MemoizeNoArgs()
    memoizedMethod2(): T {
        return this.values[this.index++]!;
    };

    // @ts-ignore TODO add tests to check compile error: https://github.com/SamVerschueren/tsd https://github.com/Microsoft/dtslint
    @MemoizeNoArgs()
    memoizedMethodWithParams(value: T): T {
        return value;
    }

    // TODO add tests to check compile error: https://github.com/SamVerschueren/tsd https://github.com/Microsoft/dtslint
    // @MemoizeNoArgs()
    param: T | undefined;

}
