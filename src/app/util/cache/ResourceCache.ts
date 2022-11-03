import { of, ReplaySubject } from 'rxjs';
import { Selector, SelectorWithProgress } from '../rxjs/selector/Selector';
import { Single } from '../rxjs/Single';
import { State } from '../state/State';

export class ResourceCache<T> extends Selector<T> implements SelectorWithProgress<T> {

    private readonly start$ = new State<void>(void 0, { equals: () => false, allowEmptyValues: true });

    readonly inProgress$: Selector<boolean>;

    private externallyProvidedValue?: T;
    private value$?: ReplaySubject<T>;

    constructor(
        private readonly deferredResourceCall: () => Single<T>,
        config?: { equals?: (previous: T, current: T) => boolean }
    ) {
        super();

        const source$: SelectorWithProgress<T> = this.start$.asyncMapWithProgress(
            () => {
                if (this.externallyProvidedValue) {
                    return Single.from(of(this.externallyProvidedValue));
                } else {
                    return this.deferredResourceCall();
                }
            },
            {
                equals: config?.equals,
                shareConfig: {
                    connector: () => {
                        this.value$ = new ReplaySubject<T>();
                        return this.value$;
                    },
                    resetOnRefCountZero: true,
                    resetOnComplete: false,
                    resetOnError: true // TODO error handling
                }
            }
        );

        this.inProgress$ = source$.inProgress$;

        this.source = source$;
    }

    select$(): Selector<T> {
        return this;
    }

    actionRefreshCache() {
        this.externallyProvidedValue = undefined;
        this.start$.set(void 0);
    }

    actionSetValue(value: T): void {
        if (this.value$) {
            this.value$.next(value);
        } else {
            this.externallyProvidedValue = value;
        }
    }

}
