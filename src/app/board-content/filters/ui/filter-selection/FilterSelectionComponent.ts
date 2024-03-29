import { FiltersUIService } from '@/board-content/filters/domain/FiltersUIService';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { Filter } from '../../domain/types/Filter';
import { FilterId } from '../../domain/types/FilterId';

@Component({
    selector: 'app-filter-selection[filter]',
    standalone: true,
    templateUrl: './FilterSelectionComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxLet,
        RxPush,
        FormsModule,
    ],
})
export class FilterSelectionComponent {

	readonly filter$ = input.required<Filter>({ alias: 'filter' });

    private readonly filterId$: Signal<FilterId> = computed(() => this.filter$().id);

	private readonly filtersUIService = inject(FiltersUIService);

	readonly isActive$: Signal<boolean | undefined> = computed(() => {
		return this.filtersUIService.activeFiltersIds$()?.has(this.filterId$())
	});

	readonly disabled$: Signal<boolean> = this.filtersUIService.filterActivityChangingDisabled$;

    setFilterActivity(setAsActive: boolean): Promise<void> {
        return this.filtersUIService.setFilterActivity(this.filterId$(), setAsActive);
    }

}
