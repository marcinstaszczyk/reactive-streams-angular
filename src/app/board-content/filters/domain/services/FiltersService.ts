import { BoardId, BoardService } from '@/board-content/board';
import { combineProgress } from '@/util/signals/combineProgress';
import { SignalResource, signalResource } from '@/util/signals/signalResource';
import { Injectable, Signal } from '@angular/core';
import { FiltersRepository } from '../repositories/FiltersRepository';
import { Filter } from '../types/Filter';
import { FilterId } from '../types/FilterId';

@Injectable()
export class FiltersService {

    readonly currentBoardId: Signal<BoardId | undefined> = this.boardService.currentBoardId;

    readonly filters: SignalResource<Filter[]> = signalResource(
        this.currentBoardId,
        (boardId: BoardId) => {
            return this.filtersRepository.selectBoardFilters(boardId);
        }
    )

    readonly activeFiltersIds: SignalResource<Set<FilterId>> = signalResource(
        this.currentBoardId,
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

    async setFilterActivity(filterId: FilterId, setAsActive: boolean): Promise<void> {
        const filterIds: Set<FilterId> = this.activeFiltersIds();
        const changedIds = new Set(filterIds);
        if (setAsActive) {
            changedIds.add(filterId);
        } else {
            changedIds.delete(filterId);
        }
        this.activeFiltersIds.set(changedIds);

        await this.filtersRepository.setActiveFilterIds(this.currentBoardId()!, changedIds);
    }

}
