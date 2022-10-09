import { Single } from '../rxjs/Single';
import { BehaviorSubject, combineLatest, map, mergeMap, Observable, of, ReplaySubject, share, take, tap } from 'rxjs';
import { ResourceVersion } from './ResourceVersion';
import { ShareReplayPipe } from '../decorators/ShareReplayPipe';
import { MemoizeNoArgs } from '../decorators/MemoizeNoArgs';

export class ResourceCache<T> {

    private start$ = new BehaviorSubject<void>(void 0);
    private requestVersion$ = new BehaviorSubject<ResourceVersion | null>(null);
    private lastResponseVersion$ = new BehaviorSubject<ResourceVersion | null>(null);

    private externallyProvidedValue?: T;
    private value$?: ReplaySubject<T>;

    constructor(
        private readonly deferredResourceCall: () => Single<T>
    ) {
    }

    @MemoizeNoArgs()
    select$(): Observable<T> {
        return this.start$.pipe(
            map(() => ResourceVersion.new(this)),
            mergeMap((version: ResourceVersion) => { // TODO mergeMap or switchMap?
                if (this.externallyProvidedValue) {
                    return of(this.externallyProvidedValue);
                } else {
                    this.requestVersion$.next(version);
                    return this.deferredResourceCall().pipe(
                        take(1),
                        tap({ // this way checking for progress is not initializing resource call.
                            complete: () => {
                                this.lastResponseVersion$.next(version);
                            } // BEHAVIOUR: version signal goes after value signal
                        })
                    )
                }
            }),
            share({
                connector: () => {
                    this.value$ = new ReplaySubject<T>();
                    return this.value$;
                },
                resetOnRefCountZero: true,
                resetOnComplete: false,
                resetOnError: true // TODO error handling
            })
        )
    }

    @ShareReplayPipe()
    @MemoizeNoArgs()
    selectLoadingInProgress$(): Observable<boolean> {
        return combineLatest([
            this.requestVersion$,
            this.lastResponseVersion$
        ]).pipe(
            map(([requestVersion, lastResponseVersion]: [ResourceVersion | null, ResourceVersion | null]) => {
                return requestVersion !== lastResponseVersion;
            })
        )
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
