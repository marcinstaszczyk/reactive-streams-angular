import { BoardId, BoardService } from '@/board-content/board';
import { combineProgress } from '@/util/signals/combineProgress';
import { SignalResource, signalResource } from '@/util/signals/signalResource';
import { Injectable } from '@angular/core';
import { FiltersRepository } from '../repositories/FiltersRepository';
import { Filter } from '../types/Filter';
import { FilterId } from '../types/FilterId';

@Injectable()
export class FiltersService {

    readonly filters: SignalResource<Filter[]> = signalResource(
        this.boardService.currentBoardId,
        (boardId: BoardId) => {
            return this.filtersRepository.selectBoardFilters(boardId);
        }
    )

    readonly activeFiltersIds: SignalResource<Set<FilterId>> = signalResource(
        this.boardService.currentBoardId,
        (boardId: BoardId) => {
            return this.filtersRepository.selectActiveFilterIds(boardId);
        },
    );

    readonly loadingInProgress = combineProgress(
        this.filters.loading,
        this.activeFiltersIds.loading
    );

    constructor(
        private readonly boardService: BoardService,
        private readonly filtersRepository: FiltersRepository,
    ) {
    }

    setFilterActivity(filterId: FilterId, setAsActive: boolean): void {
        this.activeFiltersIds.update((filterIds: Set<FilterId>) => {
            const changedIds = new Set(filterIds);
            if (setAsActive) {
                changedIds.add(filterId);
            } else {
                changedIds.delete(filterId);
            }
            return changedIds;
        });
    }

}
