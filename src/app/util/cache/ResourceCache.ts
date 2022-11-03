import { BehaviorSubject, mergeMap, of, ReplaySubject } from 'rxjs';
import { callProgress, DeferredCallWithProgress } from '../progress/callProgress';
import { Selector } from '../rxjs/selector/Selector';
import { Single } from '../rxjs/Single';

export class ResourceCache<T> extends Selector<T> {

    private readonly start$ = new BehaviorSubject<void>(void 0);
    private readonly deferredResourceCall: DeferredCallWithProgress<[], T>;

    private externallyProvidedValue?: T;
    private value$?: ReplaySubject<T>;

    constructor(
        deferredResourceCall: () => Single<T>,
        config?: { equals?: (previous: T, current: T) => boolean }
    ) {
        super();

        this.deferredResourceCall = callProgress(deferredResourceCall);

        this.initializeSource(config);
    }

    select$(): Selector<T> {
        return this;
    }

    // TODO convert to SelectorWithProgress
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

    private initializeSource(
        config?: { equals?: (previous: T, current: T) => boolean }
    ): void {
        super.initSource(
            this.start$.pipe(
                mergeMap(() => { // TODO mergeMap or switchMap?
                    if (this.externallyProvidedValue) {
                        return of(this.externallyProvidedValue);
                    } else {
                        return this.deferredResourceCall();
                    }
                }),
            ),
            {
                equals: config?.equals,
                shareConfig: {
                    connector: () => {
                        this.value$ = new ReplaySubject<T>();
                        return this.value$;
                    },
                    resetOnRefCountZero: true,
                    resetOnComplete: false,
                    resetOnError: true // TODO error handling
                }
            }
        );
    }

}
