import { Base, observeSelectorsPassingValues } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, OnChanges, Signal, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { FiltersService } from '../../domain/services/FiltersService';
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
export class FilterSelectionComponent extends Base implements OnChanges {

    @Input('filter')
    filterInput!: Filter;
    readonly filter = signal<Filter>(undefined as unknown as Filter);

    readonly filterId: Signal<FilterId> = computed(() => this.filter().id);
    readonly isActive: Signal<boolean> = computed(() => this.filtersService.activeFiltersIds().has(this.filterId()));

    constructor(
        readonly filtersService: FiltersService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filterInput']) {
            this.filter.set(this.filterInput);
        }
    }

    setFilterActivity(setAsActive: boolean): Promise<void> {
        return this.filtersService.setFilterActivity(this.filterId(), setAsActive);
    }

}
