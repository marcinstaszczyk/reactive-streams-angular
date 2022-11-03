import {
    combineLatest,
    distinctUntilChanged,
    lastValueFrom,
    map,
    Observable,
    ReplaySubject,
    share,
    ShareConfig,
    Subject,
    switchMap,
    tap,
    timeout,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { callProgress, DeferredCallWithProgress } from '../../progress/callProgress';
import { Single } from '../Single';

export function select<T>(source$: Observable<T>): Selector<T> {
    return Selector.from(source$);
}

export class Selector<T> extends Observable<T> {

    /**
     * Enables listening to values passing through Selector without activating it.
     * Activation still is done by subscribing to primary Selector/observable.
     */
    readonly passingValues$ = new Subject<T>();

    static from<T>(
        source$: Observable<T>,
        config?: SourceConfig<T>
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

    asyncMap<R>(projectFn: (t: T) => Single<R>, config?: SourceConfig<R>): Selector<R> {
        return Selector.from(
            this.pipe(switchMap(projectFn)),
            config
        );
    }

    asyncMapWithProgress<R>(projectFn: (t: T) => Single<R>, config?: SourceConfig<R>): SelectorWithProgress<R> {
        const projectFnWithProgress: DeferredCallWithProgress<[T], R> = callProgress(projectFn);

        const selector$: Selector<R> = this.asyncMap(projectFnWithProgress, config);

        const selectorWithProgress$ = selector$ as Selector<R> & InProgress;
        selectorWithProgress$.inProgress$ = projectFnWithProgress.inProgress$;

        return selectorWithProgress$;
    }

    actionGet(): Promise<T> {
        return lastValueFrom(environment.production ? this : this.pipe(
            // If waiting over 10s then it's most likely the value will never arrive and action will be stuck forever. Developer should correct this.
            timeout(10000)
        ));
    }

    protected initSource(
        source$: Observable<T>,
        config?: SourceConfig<T>
    ) {
        this.source = source$.pipe(
            distinctUntilChanged(
                config?.equals
            ),
            tap({
                next: (value: T) => {
                    this.passingValues$.next(value);
                },
                complete: () => {
                    console.error('source$ of Selector observable should never complete');
                }
            }),
            share(config?.shareConfig ?? {
                connector: () => new ReplaySubject(1),
                resetOnRefCountZero: true,
                resetOnComplete: false,
                resetOnError: true, // TODO error handling
            }),
        );
    }

}

type SourceConfig<T> = {
    equals?: (previous: T, current: T) => boolean,
    shareConfig?: ShareConfig<T>
};

type InProgress = { inProgress$: Selector<boolean> };

export type SelectorWithProgress<T> = Selector<T> & Readonly<InProgress>;
