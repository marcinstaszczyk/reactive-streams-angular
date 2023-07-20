import {
    combineLatest,
    distinctUntilChanged,
    firstValueFrom,
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

/**
 * Converts any Observable into Selector observable.
 *
 * Convenience function. See Selector.from() for more details.
 *
 * If using with RxJS operators map or switchMap, see map() or asyncMap() method instead.
 * If using with RxJS combineLatest, see combineWith() method instead.
 *
 * @example
 * // Basic usage
 * select(observable$);
 *
 * // Convert to selector after using RxJS operator(s)
 * select(
 *   selectedItem$.pipe(
 *     filter((value) => Boolean(value))
 *   )
 * );
 *
 * // Preferred declarative usage
 * class Component {
 *   readonly selectedItemOrNull$: Selector<Item | null> = ...;
 *   readonly selectedItem$: Selector<Item> = select(this.selectedItem$.pipe(
 *     filter((value) => Boolean(value))
 *   ));
 * }
 */
export function select<T>(source$: Observable<T>): Selector<T> {
    return Selector.from(source$);
}

/**
 * Selector - type of observable dedicated to processing of data in a Reactive way.
 *
 * Together with declarative programming enforces good practises of Reactive Data Flow:
 * * Re-usage of streams on multiple subscriptions.
 * * Not passing same value multiple times down the stream.
 * * Conversion and combination of streams in a performant manner.
 */
export class Selector<T> extends Observable<T> {

    /**
     * Enables listening to values passing through Selector without activating it.
     * Activation still is done by subscribing to primary Selector/observable.
     */
    readonly passingValues$ = new Subject<T>();

    /**
     * Function which converts Observable into Selector.
     * Conversion is done by applying best practises of Reactive Data Flow into Observable:
     * * distinctUntilChanged() RxJS operator - Not passing same value multiple times down the stream.
     * * share() RxJS operator - Sharing data between multiple subscriptions.
     *
     * Provided _source$_ should be observable with reactive data.
     * Use on non-reactive observables (like Single observable) is not recommended (use ResourceCache instead).
     * Use on streams of actions/events is not recommended.
     *
     * It's possible to configure how selector behaviours will be applied:
     * * config?.equals: _(previous: T, current: T) => boolean_ - defines function to distinct if stream value actually changed.
     * By default, equality check is done by object references.
     * * config?.shareConfig: _ShareConfig<T>_ - defines configuration passed to share RxJS operator.
     *
     * @param source$ observable with reactive data.
     * @param config enables configuration of selector behaviors
     * @return {Selector} observable
     */
    static from<T>(
        source$: Observable<T>,
        config?: SourceConfig<T>
    ): Selector<T> {
        const selector$ = new Selector<T>();
        selector$.initSource(source$, config);
        return selector$;
    }

    static is<T>(selectorLike$: Observable<T>): Selector<T> {
        const selector$ = new Selector<T>();
        selector$.source = selectorLike$;
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

    asyncMap<R>(projectFn: (t: T) => Observable<R>, config?: SourceConfig<R>): Selector<R> {
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

    getValue(): Promise<T> {
        return firstValueFrom(environment.production ? this : this.pipe(
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
