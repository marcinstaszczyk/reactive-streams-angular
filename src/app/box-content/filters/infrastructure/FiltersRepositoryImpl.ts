import { BoxId } from '@/box-content/box';
import { FilterDTO } from '@/box-content/filters/infrastructure/types/FilterDTO';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { FiltersRepository } from '../domain/repositories/FiltersRepository';
import { Filter } from '../domain/types/Filter';
import { FilterId } from '../domain/types/FilterId';
import { FiltersResource } from './FiltersResource';

@Injectable()
export class FiltersRepositoryImpl implements FiltersRepository {

    constructor(
        private readonly filtersResource: FiltersResource,
    ) {
    }

    selectBoxFilters(boxId: BoxId): Single<Filter[]> {
        return Single.from(
            this.filtersResource.selectBoxFilters(boxId).pipe(
                map((filterDTOs: FilterDTO[]) => {
                    return filterDTOs.map(convertFilterDTOtoFilter);
                })
            )
        )
    }

    selectActiveFilterIds(boxId: BoxId): Single<Set<FilterId>> {
        return Single.from(
            this.filtersResource.selectActiveFilterIds(boxId).pipe(
                map((filterIds: string[]) => {
                    return new Set(filterIds.map((filterId: string) => FilterId.create(filterId)));
                })
            )
        )
    }

    actionSetActiveFilterIds(boxId: BoxId, activeFilters: Set<FilterId>): Promise<void> {
        const filterIds: string[] = [...activeFilters].map((filterId: FilterId) => filterId.toString());
        return firstValueFrom(
            this.filtersResource.setActiveFiltersIds(boxId, filterIds)
        );
    }

}

function convertFilterDTOtoFilter(filterDTO: FilterDTO): Filter {
    const filterId: FilterId = FilterId.create(filterDTO.id);
    return new Filter(
        filterId,
        filterDTO.name
    );
}
