import { BoxId } from '@/box-content/box';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { MockHttpFiltersResource } from './MockHttpFiltersResource';
import { FilterDTO } from './types/FilterDTO';

@Injectable({ providedIn: 'root', useClass: MockHttpFiltersResource })
export abstract class FiltersResource {

    abstract selectBoxFilters(boxId: BoxId): Single<FilterDTO[]>;

    abstract selectActiveFilterIds(boxId: BoxId): Single<string[]>;

    abstract setActiveFiltersIds(boxId: BoxId, activeFilters: string[]): Single<void>;

}
