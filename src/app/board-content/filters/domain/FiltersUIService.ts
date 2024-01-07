import { FiltersService } from '@/board-content/filters';
import { keepLastValue } from '@/util/signals/keepLastValue';
import { safeComputed } from '@/util/signals/safeComputed';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { Filter } from './types/Filter';
import { FilterId } from './types/FilterId';

@Injectable()
export class FiltersUIService {

	private readonly filtersService = inject(FiltersService);

	private readonly filtersAndActive$ = safeComputed(
		this.filtersService.filters$,
		this.filtersService.activeFiltersIds$,
		(filters: Filter[], activeFiltersIds: Set<FilterId>) => [filters, activeFiltersIds] as const
	);

	private readonly latestFiltersAndActive$ = keepLastValue(this.filtersAndActive$);

	readonly filters$: Signal<Filter[] | undefined> = computed(() => this.latestFiltersAndActive$()?.[0]);
	readonly activeFiltersIds$: Signal<Set<FilterId> | undefined> = computed(() => this.latestFiltersAndActive$()?.[1]);

    async setFilterActivity(filterId: FilterId, setAsActive: boolean): Promise<void> {
		return this.filtersService.setFilterActivity(filterId, setAsActive, this.filtersAndActive$.context$());
    }

}
