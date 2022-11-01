import { combineLatest, distinctUntilChanged, lastValueFrom, map, Observable, ReplaySubject, share, ShareConfig, takeUntil, tap, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment';

export function select<T>(source$: Observable<T>): Selector<T> {
    return Selector.from(source$);
}

export class Selector<T> extends Observable<T> {

    protected autoSubscribed = false;

    static from<T>(
        source$: Observable<T>,
        config?: {
            distinctUntilChangedComparator?: (previous: T, current: T) => boolean,
            shareConfig?: ShareConfig<T>
        }
    ): Selector<T> {
        const selector$ = new Selector<T>();
        selector$.initSource(source$, config);
        return selector$;
    }

    protected constructor() {
        super();
    }

    map<R>(project: (t: T) => R): Selector<R> {
        return select(this.pipe(map(project)));
    }

    // TODO add more parameters
    combineWith<T1, R>(selector1: Selector<T1>, projectFn: (t: T, t1: T1) => R): Selector<R>;
    combineWith<T1, T2, R>(selector1: Selector<T1>, selector2: Selector<T1>, projectFn: (t: T, t1: T1, t2: T2) => R): Selector<R>;
    combineWith<T1, T2, T3, R>(s1: Selector<T1>, s2: Selector<T1>, s3: Selector<T1>, projectFn: (t: T, t1: T1, t2: T2, t3: T3) => R): Selector<R>;
    combineWith<R>(...selectorsAndProjectFn: Array<Selector<any> | ((...props: any[]) => R)>): Selector<R> {
        const projectFn = selectorsAndProjectFn.pop() as ((...props: any[]) => R);
        const selectors = selectorsAndProjectFn as Array<Selector<any>>;
        return select(
            combineLatest([
                this,
                ...selectors
            ]).pipe(
                map((props: any[]) => projectFn(...props))
            )
        );
    }

    actionGet(): Promise<T> {
        return lastValueFrom(environment.production ? this : this.pipe(
            // If waiting over 10s then it's most likely the value will never arrive and action will be stuck forever. Developer should correct this.
            timeout(10000)
        ));
    }

    /**
     * @Internal
     */
    autoSubscribe(destroy$: Observable<unknown>, observer: (value: T, primaryAutoSubscription: boolean) => void): void {
        const firstAutoSubscriber = !this.autoSubscribed;
        this.autoSubscribed = true;

        this.pipe(
            tap((value: T) => observer(value, firstAutoSubscriber)),
            takeUntil(destroy$)
        ).subscribe();
    }

    protected initSource(
        source$: Observable<T>,
        config?: {
            distinctUntilChangedComparator?: (previous: T, current: T) => boolean,
            shareConfig?: ShareConfig<T>
        }
    ) {
        this.source = source$.pipe(
            distinctUntilChanged(
                config?.distinctUntilChangedComparator
            ),
            tap({
                complete: () => {
                    console.error('source$ of Selector observable should never complete');
                }
            }),
            share(config?.shareConfig ?? {
                connector: () => new ReplaySubject(1),
                resetOnError: true,
                resetOnComplete: false,
                resetOnRefCountZero: true,
            }),
        );
    }

}
