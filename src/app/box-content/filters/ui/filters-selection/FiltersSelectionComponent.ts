import { FilterSelectionComponent } from '@/box-content/filters/ui/filter-selection/FilterSelectionComponent';
import { Base, observeSelectorsPassingValues, SelectorWithProgress } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { FiltersService } from '../../domain/services/FiltersService';
import { Filter } from '../../domain/types/Filter';

@Component({
    selector: 'app-filters-selection',
    standalone: true,
    templateUrl: './FiltersSelectionComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        LetModule,
        FilterSelectionComponent,
    ],
})
export class FiltersSelectionComponent extends Base {

    readonly filters$: SelectorWithProgress<Filter[]> = this.filtersService.filters$;

    constructor(
        readonly filtersService: FiltersService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    trackByBoxId(_: number, filter: Filter) {
        return filter.id;
    }

}
