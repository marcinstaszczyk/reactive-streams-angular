import { FilterSelectionComponent } from '@/board-content/filters/ui/filter-selection/FilterSelectionComponent';
import { keepLastValue } from '@/util/signals/keepLastValue';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { FiltersService } from '../../domain/FiltersService';
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
export class FiltersSelectionComponent {

    readonly filters$: Signal<Filter[] | undefined> = keepLastValue(this.filtersService.filters$);

    constructor(
        readonly filtersService: FiltersService,
    ) {
    }

}
