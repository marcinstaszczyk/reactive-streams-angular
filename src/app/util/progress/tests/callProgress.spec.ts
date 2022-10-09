import { of, Subject } from 'rxjs';
import { Single } from '../../rxjs/Single';
import { callProgress, DeferredCallWithProgress } from '../callProgress';

describe('callProgress', () => {

    let VALUE: symbol;

    beforeEach(() => {
        VALUE = Symbol(1);
    });

    describe('should proxy call for resource', () => {

        let INPUT: symbol[];
        let lastInput: symbol[] | null;
        let resourceCallWithProgress$: DeferredCallWithProgress<symbol[], symbol>

        beforeEach(() => {
            INPUT = [Symbol(2), Symbol(3), Symbol(4), Symbol(5)];
            lastInput = null;
            resourceCallWithProgress$ = callProgress((...input: symbol[]) => {
                lastInput = input;
                return Single.from(of(VALUE));
            });
        });

        it('input parameters should match', () => {
            resourceCallWithProgress$(...INPUT).subscribe();
            expect(lastInput).toEqual(INPUT);
        });

        it('output value should match', () => {
            let lastOutput: symbol | null = null;
            resourceCallWithProgress$(...INPUT).subscribe((value) => {
                lastOutput = value
            });
            expect(lastOutput).toBe(VALUE as any);
        });
    });


    describe('should return correct loading "in progress" state', () => {

        let resourceResponseSubject: Subject<symbol>;
        let resourceCallWithProgress$: DeferredCallWithProgress<[], symbol>;
        let lastInProgressState: boolean | null;

        beforeEach(() => {
            resourceResponseSubject = new Subject<symbol>();
            resourceCallWithProgress$ = callProgress(() => {
                return Single.from(resourceResponseSubject);
            });
            lastInProgressState = null;
            resourceCallWithProgress$.selectLoadingInProgress$().subscribe((inProgress: boolean) => {
                lastInProgressState = inProgress;
            });
        });

        it('"in progress" === false before selecting for data', () => {
            expect(lastInProgressState).toBeFalse();
        });

        it('"in progress" === false before subscribing for selected data', () => {
            resourceCallWithProgress$();
            expect(lastInProgressState).toBeFalse();
        });

        it('"in progress" === true after subscribing for selected data and before resource returns value', () => {
            resourceCallWithProgress$().subscribe();
            expect(lastInProgressState).toBeTrue();
        });

        it('"in progress" === false after resource returns value', () => {
            resourceCallWithProgress$().subscribe();
            resourceResponseSubject.next(VALUE);
            resourceResponseSubject.complete();
            expect(lastInProgressState).toBeFalse();
        });

        it('after resource returns value, the value signal should go before "no longer in progress" signal', () => {
            resourceCallWithProgress$().subscribe((returnedValue) => {
                expect(returnedValue).toBe(VALUE);
                expect(lastInProgressState).toBeTrue();
            });
            resourceResponseSubject.next(VALUE);
            resourceResponseSubject.complete();
            expect(lastInProgressState).toBeFalse();
        });
    });

});
