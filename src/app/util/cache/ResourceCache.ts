import { Selector } from '../rxjs/selector/Selector';
import { Single } from '../rxjs/Single';
import { BehaviorSubject, distinctUntilChanged, mergeMap, of, ReplaySubject, share } from 'rxjs';
import { callProgress, DeferredCallWithProgress } from '../progress/callProgress';

export class ResourceCache<T> extends Selector<T> {

    private readonly start$ = new BehaviorSubject<void>(void 0);
    private readonly deferredResourceCall: DeferredCallWithProgress<[], T>;

    private externallyProvidedValue?: T;
    private value$?: ReplaySubject<T>;

    constructor(
        deferredResourceCall: () => Single<T>
    ) {
        super();
        this.deferredResourceCall = callProgress(deferredResourceCall);
        this.initSource();
    }

    select$(): Selector<T> {
        return this;
    }

    selectLoadingInProgress$(): Selector<boolean> {
        return this.deferredResourceCall.selectLoadingInProgress$();
    }

    actionRefreshCache() {
        this.externallyProvidedValue = undefined;
        this.start$.next(void 0);
    }

    actionSetValue(value: T): void {
        if (this.value$) {
            this.value$.next(value);
        } else {
            this.externallyProvidedValue = value;
        }
    }

    protected override initSource() {
        this.source = this.start$.pipe(
            mergeMap(() => { // TODO mergeMap or switchMap?
                if (this.externallyProvidedValue) {
                    return of(this.externallyProvidedValue);
                } else {
                    return this.deferredResourceCall();
                }
            }),
            distinctUntilChanged(),
            share({
                connector: () => {
                    this.value$ = new ReplaySubject<T>();
                    return this.value$;
                },
                resetOnRefCountZero: true,
                resetOnComplete: false,
                resetOnError: true // TODO error handling
            })
        );
    }

}
