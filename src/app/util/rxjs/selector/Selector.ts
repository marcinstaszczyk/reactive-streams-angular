import { combineLatest, distinctUntilChanged, lastValueFrom, map, Observable, ReplaySubject, share, ShareConfig, takeUntil, tap } from 'rxjs';

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
    combineWith<T1, R>(selector1: Selector<T1>, project: (t: T, t1: T1) => R): Selector<R> {
        return select(
            combineLatest([
                this,
                selector1
            ]).pipe(
                map(([t, t1]: [T, T1]) => project(t, t1))
            )
        );
    }

    actionGet(): Promise<T> {
        return lastValueFrom(this);
    }

    /**
     * @Internal
     */
    autoSubscribe(destroy$: Observable<unknown>, observer?: (value: T) => void): void {
        if (!this.autoSubscribed) {
            this.autoSubscribed = true;
            this.pipe(
                tap(observer),
                takeUntil(destroy$)
            ).subscribe()
        } else {
            throw Error('Should not be auto-subscribed twice');
        }
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
