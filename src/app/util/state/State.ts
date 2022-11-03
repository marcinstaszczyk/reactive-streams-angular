import { firstValueFrom, mergeAll, Observable, of, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Selector } from '../rxjs/selector/Selector';

export class State<T extends Exclude<any, Function>> extends Selector<T> {

    private sources$ = new ReplaySubject<Observable<T>>(1);

    private disconnectPrevious$: Subject<void> | undefined;

    constructor(initialValue: undefined, config: { equals?: (previous: T, current: T) => boolean, allowEmptyValues: boolean });
    constructor(initialValue?: T, config?: { equals?: (previous: T, current: T) => boolean })
    constructor(
        initialValue?: T,
        config?: {
            equals?: (previous: T, current: T) => boolean,
            allowEmptyValues?: boolean
        }
    ) {
        super();

        super.initSource(
            this.sources$.pipe(
                mergeAll(),
            ),
            config
        );

        if (initialValue !== undefined || (config?.allowEmptyValues ?? false)) {
            this.set(initialValue as T);
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

}
