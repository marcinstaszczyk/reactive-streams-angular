import { FiltersUIService } from '@/board-content/filters/domain/FiltersUIService';
import { FilterSelectionComponent } from '@/board-content/filters/ui/filter-selection/FilterSelectionComponent';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
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
	providers: [
		FiltersUIService
	]
})
export class FiltersSelectionComponent {

    readonly filters$: Signal<Filter[] | undefined> = inject(FiltersUIService).filters$;

}
