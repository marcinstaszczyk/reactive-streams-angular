import { BoardId, BoardService } from '@/board-content/board';
import { AsyncSignal, AsyncSignalContext } from '@/util/signals/AsyncSignal';
import { combineProgress } from '@/util/signals/combineProgress';
import { toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { toLoading } from '@/util/signals/toLoading';
import { Injectable, Signal } from '@angular/core';
import { mergeWith, Subject } from 'rxjs';
import { FiltersRepository } from './repositories/FiltersRepository';
import { Filter } from './types/Filter';
import { FilterId } from './types/FilterId';

@Injectable()
export class FiltersService {

    readonly currentBoardId$: AsyncSignal<BoardId> = this.boardService.currentBoardId$;

    readonly filters$: AsyncSignal<Filter[]> = toAsyncSignal(
        this.currentBoardId$,
        (boardId: BoardId) => {
            return this.filtersRepository.selectBoardFilters(boardId);
        }
    )

    readonly activeFiltersIds$: AsyncSignal<Set<FilterId>> = toAsyncSignal(
        this.currentBoardId$,
        (boardId: BoardId) => {
            return this.filtersRepository.selectActiveFilterIds(boardId).pipe(
				mergeWith(this.updateFilterIds$)
			);
        },
    );

    readonly loadingInProgress$: Signal<boolean> = combineProgress(
		toLoading(this.filters$),
		toLoading(this.activeFiltersIds$)
    );

	private updateFilterIds$ = new Subject<Set<FilterId>>();

    constructor(
        private readonly boardService: BoardService,
        private readonly filtersRepository: FiltersRepository,
    ) {
    }

    async setFilterActivity(filterId: FilterId, setAsActive: boolean, context: AsyncSignalContext): Promise<void> {
        const filterIds: Set<FilterId> = context.get(this.activeFiltersIds$)!;
        const changedIds = new Set(filterIds);
        if (setAsActive) {
            changedIds.add(filterId);
        } else {
            changedIds.delete(filterId);
        }
        this.updateFilterIds$.next(changedIds);

        await this.filtersRepository.setActiveFilterIds(context.get(this.currentBoardId$)!, changedIds);
    }

}
