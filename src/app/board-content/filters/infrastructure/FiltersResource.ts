import { BoardId } from '@/board-content/board';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { MockHttpFiltersResource } from './MockHttpFiltersResource';
import { FilterDTO } from './types/FilterDTO';

@Injectable({ providedIn: 'root', useClass: MockHttpFiltersResource })
export abstract class FiltersResource {

    abstract selectBoardFilters(boardId: BoardId): Single<FilterDTO[]>;

    abstract selectActiveFilterIds(boardId: BoardId): Single<string[]>;

    abstract setActiveFiltersIds(boardId: BoardId, activeFilters: string[]): Single<void>;

}
