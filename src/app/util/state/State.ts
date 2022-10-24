import { distinctUntilChanged, firstValueFrom, mergeAll, Observable, of, ReplaySubject, shareReplay, tap } from 'rxjs';
import { Selector } from '../rxjs/selector/Selector';

export class State<T extends Exclude<any, Function>> extends Selector<T> {

    sources$ = new ReplaySubject<Observable<T>>(1);

    constructor(initialValue?: Exclude<T, undefined | null>) {
        super();
        this.initSource();
        if (initialValue !== null && initialValue !== undefined) {
            this.set(initialValue);
        }
    }

    set(value: T): void;
    set(projectFn: (oldValue: T) => T): void;
    set(valueOrProjectFn: T | ((oldValue: T) => T)): void {
        if (typeof valueOrProjectFn === 'function') {
            const projectFn = valueOrProjectFn as (oldValue: T) => T;
            if (this.autoSubscribed) {
                this.sources$.next(of(projectFn(this.lastValue!)));
            } else {
                this.asyncUpdate(projectFn);
            }
        } else {
            const value: T = valueOrProjectFn;
            this.sources$.next(of(value));
        }
    }

    private async asyncUpdate(projectFn: (oldValue: T) => T): Promise<void> {
        const oldValue: T = await firstValueFrom(this);
        this.set(projectFn(oldValue));
    }

    protected override initSource() {
        this.source = this.sources$.pipe(
            mergeAll(),
            distinctUntilChanged(),
            tap((value: T) => this.lastValue = value),
            shareReplay({
                bufferSize: 1,
                refCount: true
            })
        )
    }
}
