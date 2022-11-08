import { BoxSelectionComponent, BoxService } from '@/box-content/box';
import { FiltersSelectionComponent, FiltersService } from '@/box-content/filters';
import { Base, CircleLoaderComponent, combineProgress, observeSelectorsPassingValues, Selector } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template';

@Component({
    selector: 'app-box',
    standalone: true,
    templateUrl: './BoxContentComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
        CircleLoaderComponent,
        BoxSelectionComponent,
        FiltersSelectionComponent,
    ],
    providers: [
        BoxService, // provided in root is not getting boxId route param right
        FiltersService, // uses BoxService
    ],
})
export class BoxContentComponent extends Base {

    readonly loadingInProgress$: Selector<boolean> = combineProgress(
        this.boxService.loadingInProgress$,
        this.filtersService.loadingInProgress$
    );

    constructor(
        readonly boxService: BoxService,
        readonly filtersService: FiltersService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
