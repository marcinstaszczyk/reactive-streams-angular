import { distinctUntilChanged, firstValueFrom, mergeAll, Observable, of, ReplaySubject, shareReplay } from 'rxjs';
import { Selector } from '../rxjs/Selector';

export class State<T> extends Selector<Exclude<T, Function>> {

    sources$ = new ReplaySubject<Observable<T>>(1);

    constructor(initialValue?: Exclude<T, undefined | null>) {
        super();
        // const viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
        this.initSource();
        if (initialValue !== null && initialValue !== undefined) {
            this.set(initialValue);
        }
    }

    set(value: T): void;
    // set(projectFn: (oldValue: T) => T): void;
    set(valueOrProjectFn: T | ((oldValue: T) => T)): void {
        if (typeof valueOrProjectFn === 'function') {
            // TODO how to do this?
        } else {
            this.sources$.next(of(valueOrProjectFn))
        }
    }

    async update(projectFn: (oldValue: T) => T): Promise<void> {
        const oldValue: T = await firstValueFrom(this);
        this.set(projectFn(oldValue));
    }

    private initSource() {
        this.source = this.sources$.pipe(
            mergeAll(),
            distinctUntilChanged(),
            shareReplay({
                bufferSize: 1,
                refCount: true
            })
        )
    }
}
