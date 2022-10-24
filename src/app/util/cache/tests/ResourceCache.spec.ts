import { Observable, of, Subject } from 'rxjs';
import { Selector } from '../../rxjs/Selector';
import { ResourceCache } from '../ResourceCache';
import { Single } from '../../rxjs/Single';

describe('Resource Cache', () => {
    let VALUE: symbol;
    let resourceCalledCount: number;
    let resourceCache: ResourceCache<symbol>;
    let returnedValue: symbol | null = null;

    beforeEach(() => {
        VALUE = Symbol(1);
        resourceCalledCount = 0;
        resourceCache = new ResourceCache(() => {
            ++resourceCalledCount;
            return Single.from(of(VALUE));
        });
        returnedValue = null;
    });

    it('should return value from resource when selecting for data', () => {
        resourceCache.select$().subscribe((value) => {
            returnedValue = value;
        });

        expect(returnedValue).toBe(VALUE as any);
    });

    describe('should not call resource', () => {
        it('before selecting for data', () => {
            expect(resourceCalledCount).toBe(0);
        });

        it('until returned observable is subscribed to', () => {
            const callForResource: Observable<symbol> = resourceCache.select$();
            expect(resourceCalledCount).toBe(0);

            callForResource.subscribe();

            expect(resourceCalledCount).toBe(1);
        });
    });

    describe('second call and subscription', () => {
        beforeEach(() => {
            resourceCache.select$().subscribe();
            resourceCache.select$().subscribe((value) => {
                returnedValue = value;
            });
        });

        it('should not call resource twice', () => {
            expect(resourceCalledCount).not.toBe(2);
            expect(resourceCalledCount).toBe(1);
        });

        it('should return same value', () => {
            expect(returnedValue).toBe(VALUE as any);
        });
    });

    describe('should return correct loading "in progress" state', () => {
        let resourceResponseSubject: Subject<symbol>;
        let lastInProgressState: boolean | null;

        beforeEach(() => {
            resourceResponseSubject = new Subject<symbol>();
            resourceCache = new ResourceCache(() => {
                return Single.from(resourceResponseSubject);
            });
            lastInProgressState = null;
            resourceCache.selectLoadingInProgress$().subscribe((inProgress: boolean) => {
                lastInProgressState = inProgress;
            });
        });

        it('"in progress" === false before selecting for data', () => {
            expect(lastInProgressState).toBeFalse();
        });

        it('"in progress" === false before subscribing for selected data', () => {
            resourceCache.select$();
            expect(lastInProgressState).toBeFalse();
        });

        it('"in progress" === true after subscribing for selected data and before resource returns value', () => {
            resourceCache.select$().subscribe();
            expect(lastInProgressState).toBeTrue();
        });

        it('"in progress" === false after resource returns value', () => {
            resourceCache.select$().subscribe();
            resourceResponseSubject.next(VALUE);
            resourceResponseSubject.complete();
            expect(lastInProgressState).toBeFalse();
        });

        it('after resource returns value, the value signal should go before "no longer in progress" signal', () => {
            resourceCache.select$().subscribe((returnedValue) => {
                expect(returnedValue).toBe(VALUE);
                expect(lastInProgressState).toBeTrue();
            });
            resourceResponseSubject.next(VALUE);
            resourceResponseSubject.complete();
            expect(lastInProgressState).toBeFalse();
        });
    });

    it('should not initialize resource call when checking for progress', () => {
        resourceCache.selectLoadingInProgress$().subscribe();
        expect(resourceCalledCount).toBe(0);
    });

    describe('should enable refreshing of the cache', () => {
        it('and redo resource call if subscribed', () => {
            resourceCache.select$().subscribe();
            resourceCache.actionRefreshCache();
            expect(resourceCalledCount).toBe(2);
        });

        it('and also return second value to all subscribers', () => {
            let SECOND_VALUE = Symbol(2);
            resourceCache = new ResourceCache<symbol>(() => {
                return Single.from(of(resourceCalledCount++ === 0 ? VALUE : SECOND_VALUE));
            })
            resourceCache.select$().subscribe((value) => {
                returnedValue = value;
            });
            resourceCache.actionRefreshCache();
            expect(returnedValue).toBe(SECOND_VALUE);
            expect(returnedValue).not.toBe(VALUE);
        });

        it('but should not call resource if never subscribed', () => {
            resourceCache.select$();
            resourceCache.actionRefreshCache();
            expect(resourceCalledCount).toBe(0);
        });

        it('but should not call resource if already unsubscribed', () => {
            resourceCache.select$().subscribe().unsubscribe();
            expect(resourceCalledCount).toBe(1);
            resourceCache.actionRefreshCache();
            expect(resourceCalledCount).toBe(1);
        });
    });

    describe('should enable external providing of value', () => {
        let EXTERNAL_VALUE: symbol;

        beforeEach(() => {
            EXTERNAL_VALUE = Symbol(2);
        });

        it('and should return it to subscribers', () => {
            resourceCache.select$().subscribe((value) => {
                returnedValue = value;
            });
            resourceCache.actionSetValue(EXTERNAL_VALUE);
            expect(returnedValue).toBe(EXTERNAL_VALUE);
            expect(returnedValue).not.toBe(VALUE);
        });

        describe('if done before first subscription', () => {
            it('should return value without resource call', () => {
                resourceCache.actionSetValue(EXTERNAL_VALUE);
                resourceCache.select$().subscribe((returnedValue) => {
                    expect(returnedValue).toBe(EXTERNAL_VALUE);
                    expect(returnedValue).not.toBe(VALUE);
                });
                expect(resourceCalledCount).toBe(0);
            });

            it('should not cause "in progress" === true signal', () => {
                resourceCache.selectLoadingInProgress$().subscribe((inProgress: boolean) => {
                    expect(inProgress).toBeFalse();
                });
                resourceCache.actionSetValue(EXTERNAL_VALUE);
            });
        });

        it('should still enable refreshing of the cache', () => {
            resourceCache.actionSetValue(EXTERNAL_VALUE);
            resourceCache.select$().subscribe((value) => {
                returnedValue = value;
            });
            resourceCache.actionRefreshCache();
            expect(resourceCalledCount).toBe(1);
            expect(returnedValue).toBe(VALUE);
        });
    });

    it('using itself or calling select$() should have no difference', () => {
        expect(resourceCache.select$()).toBe(resourceCache as Selector<symbol>);
    });

});
