import { Single } from '../rxjs/Single';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap } from 'rxjs';
import { ResourceVersion } from './ResourceVersion';
import { ShareReplayPipe } from '../decorators/ShareReplayPipe';
import { MemoizeNoArgs } from '../decorators/MemoizeNoArgs';

export class ResourceCache<T> {

    private requestVersion$ = new BehaviorSubject<ResourceVersion | null>(null);
    private lastResponseVersion$ = new BehaviorSubject<ResourceVersion | null>(null);
    private lastResponse: T | null = null;


    constructor(
        private readonly deferredResourceCall: () => Single<T>
    ) {
    }

    @ShareReplayPipe()
    @MemoizeNoArgs()
    select$(): Observable<T> {
        this.requestVersion$.next(ResourceVersion.new(this));

        return this.requestVersion$.pipe(
            switchMap((version: ResourceVersion | null) => { // TODO will mergeMap ever be needed?
                return this.deferredResourceCall().pipe(
                    tap({ // this way checking for progress is not initializing resource call.
                        next: (response: T) => this.lastResponse = response,
                        complete: () => this.lastResponseVersion$.next(version) // BEHAVIOUR: version signal goes after value signal
                    })
                )
            })
        )
    }

    @ShareReplayPipe()
    @MemoizeNoArgs()
    selectLoadingInProgress$(): Observable<boolean> { // Idea: take(1)+tap(complete)
        // BEHAVIOUR: checking for progress should not initialize resource call.
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
        this.requestVersion$.next(ResourceVersion.new(this));
    }

}
