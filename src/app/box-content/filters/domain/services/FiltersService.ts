import { BoxId, BoxService } from '@/box-content/box';
import { combineProgress, Selector, SelectorWithProgress } from '@/util';
import { Injectable } from '@angular/core';
import { FiltersRepository } from '../repositories/FiltersRepository';
import { Filter } from '../types/Filter';
import { FilterId } from '../types/FilterId';

@Injectable()
export class FiltersService {

    readonly currentBoxId$: Selector<BoxId> = this.boxService.currentBoxId$;
    readonly filters$: SelectorWithProgress<Filter[]> = this.currentBoxId$
        .asyncMapWithProgress((boxId: BoxId) => {
            return this.filtersRepository.selectBoxFilters(boxId);
        });

    readonly activeFiltersIds$: SelectorWithProgress<Set<FilterId>> = this.currentBoxId$
        .asyncMapWithProgress((boxId: BoxId) => {
            return this.filtersRepository.selectActiveFilterIds(boxId);
        });

    readonly loadingInProgress$ = combineProgress(
        this.filters$.inProgress$,
        this.activeFiltersIds$.inProgress$
    );

    constructor(
        private readonly boxService: BoxService,
        private readonly filtersRepository: FiltersRepository,
    ) {
    }

    async actionSetActiveFilters(activeFilters: Set<FilterId>): Promise<void> {
        const boxId: BoxId = await this.currentBoxId$.actionGet();
        await this.filtersRepository.actionSetActiveFilterIds(boxId, activeFilters);
    }

    async actionSetFilterActivity(filterId: FilterId, setAsActive: boolean): Promise<void> {
        const filterIds: Set<FilterId> = await this.activeFiltersIds$.actionGet();
        const changedIds = new Set(filterIds);
        if (setAsActive) {
            changedIds.add(filterId);
        } else {
            changedIds.delete(filterId);
        }

        await this.actionSetActiveFilters(changedIds);
    }

}
