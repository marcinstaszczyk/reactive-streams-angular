import { BoardId } from '@/board-content/board';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { delay, of, tap } from 'rxjs';
import { FiltersResource } from './FiltersResource';
import { FilterDTO } from './types/FilterDTO';

@Injectable()
export class MockHttpFiltersResource implements FiltersResource {

    selectBoardFilters(boardId: BoardId): Single<FilterDTO[]> {
        console.log('selectBoardFilters', boardId);
        const filterDTOs: FilterDTO[] = [1,2,3,4,5].map((index: number) => generateMockFilterDTO(boardId.toString(), index));

        return Single.from(
            of(filterDTOs).pipe(
                delay(300)
            )
        );
    }

    selectActiveFilterIds(boardId: BoardId): Single<string[]> {
        console.log('selectActiveFilterIds', boardId);
        const string: string | null = localStorage.getItem(this.getLocalStorageKey(boardId));
        const filters: string[] = string ? JSON.parse(string) : [];

        return Single.from(
            of(filters).pipe(
                delay(200)
            )
        );
    }

    setActiveFiltersIds(boardId: BoardId, activeFilters: string[]): Single<void> {
        return Single.from(
            of(void 0).pipe(
                delay(200),
                tap(() => {
                    localStorage.setItem(this.getLocalStorageKey(boardId), JSON.stringify(activeFilters));
                })
            )
        );
    }

    private getLocalStorageKey(boardId: BoardId): string {
        return `activeFilters_mock_for_board_${boardId.toString()}`
    }
}

function generateMockFilterDTO(boardId: string, index: number): FilterDTO {
    return {
        id: `F${index}-${boardId}`,
        name: `Filter ${index} for ${boardId}`,
    }
}
