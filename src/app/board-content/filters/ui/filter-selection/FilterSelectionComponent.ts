import { FiltersUIService } from '@/board-content/filters/domain/FiltersUIService';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input, OnChanges, Signal, signal, SimpleChanges } from '@angular/core';
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
export class FilterSelectionComponent implements OnChanges {

    @Input({ alias: 'filter', required: true })
    filterInput!: Filter;
    readonly filter$ = signal<Filter>(undefined as unknown as Filter);
    private readonly filterId$: Signal<FilterId> = computed(() => this.filter$().id);

	private readonly filtersUIService = inject(FiltersUIService);

	readonly isActive$: Signal<boolean | undefined> = computed(() => {
		return this.filtersUIService.activeFiltersIds$()?.has(this.filterId$())
	});

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filterInput']) {
            this.filter$.set(this.filterInput);
        }
    }

    setFilterActivity(setAsActive: boolean): Promise<void> {
        return this.filtersUIService.setFilterActivity(this.filterId$(), setAsActive);
    }

}
