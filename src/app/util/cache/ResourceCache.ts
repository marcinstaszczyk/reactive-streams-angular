import { of, ReplaySubject } from 'rxjs';
import { Selector, SelectorWithProgress } from '../rxjs/selector/Selector';
import { Single } from '../rxjs/Single';
import { State } from '../state/State';

export class ResourceCache<T, S = null> extends Selector<T> implements SelectorWithProgress<T> {

    readonly inProgress$: Selector<boolean>;

    private readonly start$: State<S>;
    private lastStartValue?: S;

    private externallyProvidedValue?: T;
    private value$?: ReplaySubject<T>;

    constructor(deferredResourceCall: () => Single<T>);
    constructor(
        deferredResourceCall: () => Single<T>,
        config?: {
            equals?: (previous: T, current: T) => boolean,
        }
    );
    constructor(
        deferredResourceCall: (source: S) => Single<T>,
        config: {
            equals?: (previous: T, current: T) => boolean,
            start$: Selector<S>,
        }
    );
    constructor(
        private readonly deferredResourceCall: (source: S) => Single<T>,
        config?: {
            equals?: (previous: T, current: T) => boolean,
            start$?: Selector<S>,
        }
    ) {
        super();

        this.start$ = this.getStart(config);

        const source$: SelectorWithProgress<T> = this.getSource(config);

        this.inProgress$ = source$.inProgress$;

        this.source = source$;
    }

    select$(): Selector<T> {
        return this;
    }

    refreshCache() {
        this.externallyProvidedValue = undefined;
        if (this.lastStartValue !== undefined) {
            this.start$.set(this.lastStartValue);
        }
    }

    // TODO add check to last value
    setValue(value: T): void {
        if (this.value$) {
            this.value$.next(value);
        } else {
            this.externallyProvidedValue = value;
        }
    }

    private getStart(config?: { start$?: Selector<S> }): State<S> {
        if (config?.start$) {
            const start$ = new State<S>(undefined, { equals: () => false });
            start$.connect(config?.start$);
            return start$;
        } else {
            return new State<S>(null as unknown as S, { equals: () => false });
        }
    }

    private getSource(config?: { equals?: ((previous: T, current: T) => boolean) }): SelectorWithProgress<T> {
        return this.start$.asyncMapWithProgress(
            (value: S) => {
                this.lastStartValue = value;
                if (this.externallyProvidedValue) {
                    return Single.from(of(this.externallyProvidedValue));
                } else {
                    return this.deferredResourceCall(value);
                }
            },
            {
                equals: config?.equals,
                shareConfig: {
                    connector: () => {
                        this.value$ = new ReplaySubject<T>(1);
                        return this.value$;
                    },
                    resetOnRefCountZero: true,
                    resetOnComplete: false,
                    resetOnError: true, // TODO error handling
                },
            },
        );
    }

}
