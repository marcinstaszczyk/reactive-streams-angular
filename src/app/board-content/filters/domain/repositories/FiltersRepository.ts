import { BoardId } from '@/board-content/board';
import { Filter } from '@/board-content/filters/domain/types/Filter';
import { FilterId } from '@/board-content/filters/domain/types/FilterId';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { FiltersRepositoryImpl } from '../../infrastructure/FiltersRepositoryImpl';

@Injectable({ providedIn: 'root', useClass: FiltersRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class FiltersRepository {
    abstract selectBoardFilters(boardId: BoardId): Single<Filter[]>

    abstract selectActiveFilterIds(boardId: BoardId): Single<Set<FilterId>>;

    abstract actionSetActiveFilterIds(boardId: BoardId, activeFilters: Set<FilterId>): Promise<void>;
}
