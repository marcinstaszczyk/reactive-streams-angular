import { select, Selector, Single } from '@/util';
import { BehaviorSubject, delay, filter, ignoreElements, map, mergeWith, Observable, switchMap, tap } from 'rxjs';

export class ItemsCache<K, V> {

    cache$ = new BehaviorSubject(new Map<K, V>());

    constructor(
        protected resource: (keys: K[]) => Single<V[]>,
        protected getKey: (value: V) => K
    ) {
    }

    selectItems(itemIds: K[]): Observable<Array<V | undefined>> {
        return this.cache$.pipe(
            map((cache: Map<K, V>) => itemIds.map((itemId: K) => cache.get(itemId))),
        );
    }

    selectItem(itemId: K): Selector<V | undefined> {
        const item$: Selector<V | undefined> = select(
            this.cache$.pipe(
                map((cache: Map<K, V>) => cache.get(itemId)),
            )
        );
        const resourceLoadingProcess$: Observable<never> = item$.pipe(
            filter((item) => !item),
            delay(20),
            switchMap(() => this.resource([itemId])),
            tap((wrappedItem: V[]) => this.setItems(wrappedItem)),
            ignoreElements()
        );
        return Selector.is(item$.pipe(
            mergeWith(resourceLoadingProcess$)
        ));
    }

    setItems(items: V[]): void {
        const cache: Map<K, V> = this.cache$.value;
        items.forEach((value: V) => cache.set(this.getKey(value), value));
        this.cache$.next(cache);
    }

    clearCache(): void {
        this.cache$.next(new Map<K, V>());
    }

}
