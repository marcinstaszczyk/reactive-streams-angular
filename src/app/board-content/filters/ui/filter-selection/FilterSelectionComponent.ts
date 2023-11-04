import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { safeComputed } from '@/util/signals/safeComputed';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, OnChanges, Signal, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { FiltersService } from '../../domain/FiltersService';
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

    readonly filterId$: Signal<FilterId> = computed(() => this.filter$().id);

    readonly isActive$: AsyncSignal<boolean> = safeComputed(
        this.filtersService.activeFiltersIds$,
        (activeFilterIds: Set<FilterId>) => activeFilterIds.has(this.filterId$())
    );

    constructor(
        readonly filtersService: FiltersService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filterInput']) {
            this.filter$.set(this.filterInput);
        }
    }

    setFilterActivity(setAsActive: boolean): Promise<void> {
        return this.filtersService.setFilterActivity(this.filterId$(), setAsActive);
    }

}
