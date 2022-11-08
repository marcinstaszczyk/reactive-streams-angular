import { BoxId } from '@/box-content/box';
import { Filter } from '@/box-content/filters/domain/types/Filter';
import { FilterId } from '@/box-content/filters/domain/types/FilterId';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { FiltersRepositoryImpl } from '../../infrastructure/FiltersRepositoryImpl';

@Injectable({ providedIn: 'root', useClass: FiltersRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class FiltersRepository {
    abstract selectBoxFilters(boxId: BoxId): Single<Filter[]>

    abstract selectActiveFilterIds(boxId: BoxId): Single<Set<FilterId>>;

    abstract actionSetActiveFilterIds(boxId: BoxId, activeFilters: Set<FilterId>): Promise<void>;
}
