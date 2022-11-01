import { distinctUntilChanged, firstValueFrom, mergeAll, Observable, of, ReplaySubject, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { Selector } from '../rxjs/selector/Selector';

export class State<T extends Exclude<any, Function>> extends Selector<T> {

    private sources$ = new ReplaySubject<Observable<T>>(1);

    private lastValue: T | undefined;

    private disconnectPrevious$: Subject<void> | undefined;

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
            this.asyncUpdate(projectFn);
        } else {
            const value: T = valueOrProjectFn;
            this.sources$.next(of(value));
        }
    }

    // TODO Split into State/Atom and InputSelector?
    connect(obs$: Observable<T>, config?: { previousConnectionHandling: 'fail' | 'disconnect' | 'append' }): void {
        if (this.disconnectPrevious$) {
            const previousConnectionHandling = config?.previousConnectionHandling ?? 'fail';
            if (previousConnectionHandling === 'fail') {
                throw Error('Adding second connection to state with previousConnectionHandling = "fail"');
            } else if (previousConnectionHandling === 'disconnect') {
                this.disconnectPrevious$.next();
            }
        }

        if (!this.disconnectPrevious$) {
            this.disconnectPrevious$ = new Subject<void>();
        }

        obs$ = obs$.pipe(
            takeUntil(this.disconnectPrevious$)
        );
        this.sources$.next(obs$);
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
