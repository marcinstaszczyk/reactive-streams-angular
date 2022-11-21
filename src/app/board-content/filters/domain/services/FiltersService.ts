import { BoardId, BoardService } from '@/board-content/board';
import { combineProgress, ResourceCache, Selector, SelectorWithProgress } from '@/util';
import { Injectable } from '@angular/core';
import { FiltersRepository } from '../repositories/FiltersRepository';
import { Filter } from '../types/Filter';
import { FilterId } from '../types/FilterId';

@Injectable()
export class FiltersService {

    readonly currentBoardId$: Selector<BoardId> = this.boardService.currentBoardId$;
    readonly filters$: SelectorWithProgress<Filter[]> = this.currentBoardId$
        .asyncMapWithProgress((boardId: BoardId) => {
            return this.filtersRepository.selectBoardFilters(boardId);
        });

    readonly activeFiltersIds$ = new ResourceCache(
        (boardId: BoardId) => {
            return this.filtersRepository.selectActiveFilterIds(boardId);
        },
        { start$: this.currentBoardId$ }
    );

    readonly loadingInProgress$ = combineProgress(
        this.filters$.inProgress$,
        this.activeFiltersIds$.inProgress$
    );

    constructor(
        private readonly boardService: BoardService,
        private readonly filtersRepository: FiltersRepository,
    ) {
    }

    async setFilterActivity(filterId: FilterId, setAsActive: boolean): Promise<void> {
        const filterIds: Set<FilterId> = await this.activeFiltersIds$.getValue();
        const changedIds = new Set(filterIds);
        if (setAsActive) {
            changedIds.add(filterId);
        } else {
            changedIds.delete(filterId);
        }

        await this.setActiveFilters(changedIds);
    }

    private async setActiveFilters(activeFilters: Set<FilterId>): Promise<void> {
        const boardId: BoardId = await this.currentBoardId$.getValue();
        this.activeFiltersIds$.setValue(activeFilters);
        await this.filtersRepository.setActiveFilterIds(boardId, activeFilters);
    }

}
