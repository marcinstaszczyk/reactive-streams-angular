import { Base, observeSelectorsPassingValues, Selector, State } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

    @Input()
    filter!: Filter;

    readonly filter$ = new State<Filter>();
    readonly filterId$ = this.filter$.map((filter: Filter) => filter.id);
    readonly isActive$: Selector<boolean> = this.filterId$.combineWith(
        this.filtersService.activeFiltersIds$,
        (filterId: FilterId, activeFilters: Set<FilterId>) => activeFilters.has(filterId)
    );

    constructor(
        readonly filtersService: FiltersService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filter']) {
            this.filter$.set(this.filter);
        }
    }

    setFilterActivity(setAsActive: boolean): void {
        this.filtersService.setFilterActivity(this.filter.id, setAsActive);
    }

}
