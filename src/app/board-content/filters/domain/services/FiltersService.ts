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
    readonly filters: SignalResource<Filter[] | undefined> = signalResource(
        this.currentBoardId,
        (boardId: BoardId) => {
            return this.filtersRepository.selectBoardFilters(boardId);
        }
    )

    readonly activeFiltersIds: SignalResource<Set<FilterId> | undefined> = signalResource(
        this.currentBoardId,
        (boardId: BoardId) => {
            return this.filtersRepository.selectActiveFilterIds(boardId);
        },
    );

    readonly loading = combineProgress(
        this.filters.loading,
        this.activeFiltersIds.loading
    );

    constructor(
        private readonly boardService: BoardService,
        private readonly filtersRepository: FiltersRepository,
    ) {
    }

    setFilterActivity(filterId: FilterId, setAsActive: boolean): void {
        this.activeFiltersIds.update((filterIds: Set<FilterId> | undefined) => {
            const changedIds = new Set(filterIds);
            if (setAsActive) {
                changedIds.add(filterId);
            } else {
                changedIds.delete(filterId);
            }
            return changedIds;
        });
    }

    private async setActiveFilters(activeFilters: Set<FilterId>): Promise<void> {
        const boardId: BoardId = this.currentBoardId()!;
        this.activeFiltersIds.set(activeFilters);
        await this.filtersRepository.setActiveFilterIds(boardId, activeFilters);
    }

}
