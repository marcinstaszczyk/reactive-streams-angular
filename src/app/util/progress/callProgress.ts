import { select, Selector } from '../rxjs/selector/Selector';
import { Single } from '../rxjs/Single';
import { BehaviorSubject, combineLatest, defer, map, of, switchMap, take, tap } from 'rxjs';
import { ResourceVersion } from '../cache/ResourceVersion';

export type Progress = {
    selectLoadingInProgress$: () => Selector<boolean>;
};

type DeferredCall<Args extends any[], R> = (...args: Args) => Single<R>;

export type DeferredCallWithProgress<Args extends any[], R> = DeferredCall<Args, R> & Readonly<Progress>;

export function callProgress<Args extends any[], R>(
    deferredCall: DeferredCall<Args, R>
): DeferredCallWithProgress<Args, R> {
    const requestVersion$ = new BehaviorSubject<ResourceVersion | null>(null);
    const lastResponseVersion$ = new BehaviorSubject<ResourceVersion | null>(null);

    const deferredCallProxy: DeferredCall<Args, R> = (...args: Args): Single<R> => {
        return defer(() => of(ResourceVersion.new())).pipe(
            tap((version: ResourceVersion) => {
                requestVersion$.next(version);
            }),
            switchMap((version: ResourceVersion) => {
                return deferredCall(...args).pipe(
                    take(1),
                    tap({
                        complete: () => {
                            lastResponseVersion$.next(version);
                        } // BEHAVIOUR: version signal goes after value signal
                    })
                )
            })
        ) as Single<R>;
    }

    const deferredCallWithProgress = deferredCallProxy as DeferredCall<Args, R> & Progress;
    deferredCallWithProgress.selectLoadingInProgress$ = function (): Selector<boolean> {
        return select(
            combineLatest([
                requestVersion$,
                lastResponseVersion$
            ]).pipe(
                map(([requestVersion, lastResponseVersion]: [ResourceVersion | null, ResourceVersion | null]) => {
                    return requestVersion !== lastResponseVersion;
                }),
            )
        );
    }

    return deferredCallWithProgress;
}
