import { Single } from '../rxjs/Single';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { ResourceVersion } from './ResourceVersion';
import { ShareReplayPipe } from '../decorators/ShareReplayPipe';
import { MemoizeNoArgs } from '../decorators/MemoizeNoArgs';

export class ResourceCache<T> {

    private requestVersion$ = new BehaviorSubject<ResourceVersion>(ResourceVersion.new(this))

    constructor(
        private readonly deferredResourceCall: () => Single<T>
    ) {
    }

    @ShareReplayPipe()
    @MemoizeNoArgs()
    select$(): Observable<T> {
        return this.selectResourceAndVersion$().pipe(
            map(([resource, _]: readonly [T, ResourceVersion]) => resource)
        );
    }

    @ShareReplayPipe()
    @MemoizeNoArgs()
    selectLoadingInProgress$(): Observable<boolean> { // TODO checking for progress should not initialize resource call. Idea: take(1)+tap(complete)
        return combineLatest([
            this.requestVersion$,
            this.selectResourceAndVersion$()
        ]).pipe(
            map(([requestVersion, [_, resourceVersion]]: [ResourceVersion, readonly [T, ResourceVersion]]) => {
                return requestVersion === resourceVersion;
            })
        )
    }

    @ShareReplayPipe()
    @MemoizeNoArgs()
    selectResourceAndVersion$(): Observable<readonly [resource: T, version: ResourceVersion]> {
        return this.requestVersion$.pipe(
            switchMap((version: ResourceVersion) => { // TODO will mergeMap ever be needed?
                return this.deferredResourceCall().pipe(
                    map((resource: T) => [resource, version] as const)
                )
            })
        )
    }

    actionRefreshCache() {
        this.requestVersion$.next(ResourceVersion.new(this));
    }

}
