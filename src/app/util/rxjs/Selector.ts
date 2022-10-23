import { combineLatest, distinctUntilChanged, map, Observable, ReplaySubject, share, ShareConfig, tap } from 'rxjs';

export function select<T>(source$: Observable<T>): Selector<T> {
    return Selector.from(source$);
}

export class Selector<T> extends Observable<T> {

    static from<T>(
        source$: Observable<T>,
        config?: {
            distinctUntilChangedComparator?: (previous: T, current: T) => boolean,
            shareConfig?: ShareConfig<T>
        }
    ): Selector<T> {
        source$ = source$.pipe(
            tap({
                complete: () => {
                    console.error('source$ of Selector observable should never complete');
                }
            }),
            distinctUntilChanged(
                config?.distinctUntilChangedComparator
            ),
            share(config?.shareConfig ?? {
                connector: () => new ReplaySubject(1),
                resetOnError: true,
                resetOnComplete: false,
                resetOnRefCountZero: true,
            }),
        );
        const selector$ = new Selector<T>();
        selector$.source = source$;
        return selector$;
    }

    protected constructor() {
        super();
    }

    public combineWith<T1, R>(selector1: Selector<T1>, project: (t: T, t1: T1) => R): Selector<R> {
        return select(
            combineLatest([
                this,
                selector1
            ]).pipe(
                map(([t, t1]: [T, T1]) => project(t, t1))
            )
        );
    }

    public map<R>(project: (t: T) => R): Selector<R> {
        return select(this.pipe(map(project)));
    }

}
