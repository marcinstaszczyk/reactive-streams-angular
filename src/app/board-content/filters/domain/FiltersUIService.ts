import { FiltersService } from '@/board-content/filters';
import { keepLastValue } from '@/util/signals/keepLastValue';
import { inject, Injectable, Signal } from '@angular/core';
import { Filter } from './types/Filter';
import { FilterId } from './types/FilterId';

@Injectable()
export class FiltersUIService {

	private readonly filtersService = inject(FiltersService);

	readonly filters$: Signal<Filter[] | undefined> = keepLastValue(this.filtersService.filters$);
	readonly activeFiltersIds$: Signal<Set<FilterId> | undefined> = keepLastValue(this.filtersService.activeFiltersIds$);

	readonly filterActivityChangingDisabled$: Signal<boolean> = this.filtersService.loadingInProgress$;

    async setFilterActivity(filterId: FilterId, setAsActive: boolean): Promise<void> {
		if (this.filterActivityChangingDisabled$()) {
			throw new Error('Filter activity changing should be disabled');
		}
		return this.filtersService.setFilterActivity(filterId, setAsActive, this.filtersService.activeFiltersIds$.context$());
    }

}
