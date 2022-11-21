import { BoardId } from '@/board-content/board';
import { FilterDTO } from '@/board-content/filters/infrastructure/types/FilterDTO';
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

    selectBoardFilters(boardId: BoardId): Single<Filter[]> {
        return Single.from(
            this.filtersResource.selectBoardFilters(boardId).pipe(
                map((filterDTOs: FilterDTO[]) => {
                    return filterDTOs.map(convertFilterDTOtoFilter);
                })
            )
        )
    }

    selectActiveFilterIds(boardId: BoardId): Single<Set<FilterId>> {
        return Single.from(
            this.filtersResource.selectActiveFilterIds(boardId).pipe(
                map((filterIds: string[]) => {
                    return new Set(filterIds.map((filterId: string) => FilterId.create(filterId)));
                })
            )
        )
    }

    setActiveFilterIds(boardId: BoardId, activeFilters: Set<FilterId>): Promise<void> {
        const filterIds: string[] = [...activeFilters].map((filterId: FilterId) => filterId.toString());
        return firstValueFrom(
            this.filtersResource.setActiveFiltersIds(boardId, filterIds)
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
