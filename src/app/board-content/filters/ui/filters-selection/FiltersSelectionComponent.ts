import { FilterSelectionComponent } from '@/board-content/filters/ui/filter-selection/FilterSelectionComponent';
import { Base, observeSelectorsPassingValues } from '@/util';
import { SignalResource } from '@/util/signals/signalResource';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { FiltersService } from '../../domain/services/FiltersService';
import { Filter } from '../../domain/types/Filter';

@Component({
    selector: 'app-filters-selection',
    standalone: true,
    templateUrl: './FiltersSelectionComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxLet,
        FilterSelectionComponent,
    ],
})
export class FiltersSelectionComponent extends Base {

    readonly filters: SignalResource<Filter[]> = this.filtersService.filters;

    constructor(
        readonly filtersService: FiltersService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    trackByBoardId(_: number, filter: Filter) {
        return filter.id;
    }

}
