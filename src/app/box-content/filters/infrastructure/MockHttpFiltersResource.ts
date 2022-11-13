import { BoxId } from '@/box-content/box';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { delay, of, tap } from 'rxjs';
import { FiltersResource } from './FiltersResource';
import { FilterDTO } from './types/FilterDTO';

@Injectable()
export class MockHttpFiltersResource implements FiltersResource {

    selectBoxFilters(boxId: BoxId): Single<FilterDTO[]> {
        const filterDTOs: FilterDTO[] = [1,2,3,4,5].map((index: number) => generateMockFilterDTO(boxId.toString(), index));

        return Single.from(
            of(filterDTOs).pipe(
                delay(300)
            )
        );
    }

    selectActiveFilterIds(boxId: BoxId): Single<string[]> {
        const string: string | null = localStorage.getItem(this.getLocalStorageKey(boxId));
        const filters: string[] = string ? JSON.parse(string) : [];

        return Single.from(
            of(filters).pipe(
                delay(200)
            )
        );
    }

    setActiveFiltersIds(boxId: BoxId, activeFilters: string[]): Single<void> {
        return Single.from(
            of(void 0).pipe(
                delay(200),
                tap(() => {
                    localStorage.setItem(this.getLocalStorageKey(boxId), JSON.stringify(activeFilters));
                })
            )
        );
    }

    private getLocalStorageKey(boxId: BoxId): string {
        return `activeFilters_mock_for_box_${boxId.toString()}`
    }
}

function generateMockFilterDTO(boxId: string, index: number): FilterDTO {
    return {
        id: `F${index}-${boxId}`,
        name: `Filter ${index} for ${boxId}`,
    }
}
