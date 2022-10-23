import { Selector } from '../rxjs/Selector';
import { Single } from '../rxjs/Single';
import { BehaviorSubject, mergeMap, of, ReplaySubject } from 'rxjs';
import { MemoizeNoArgs } from '../decorators/MemoizeNoArgs';
import { callProgress, DeferredCallWithProgress } from '../progress/callProgress';

export class ResourceCache<T> {

    private readonly start$ = new BehaviorSubject<void>(void 0);
    private readonly deferredResourceCall: DeferredCallWithProgress<[], T>;

    private externallyProvidedValue?: T;
    private value$?: ReplaySubject<T>;

    constructor(
        deferredResourceCall: () => Single<T>
    ) {
        this.deferredResourceCall = callProgress(deferredResourceCall)
    }

    @MemoizeNoArgs()
    select$(): Selector<T> {
        return Selector.from(
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
        )
    }

    @MemoizeNoArgs()
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

}
