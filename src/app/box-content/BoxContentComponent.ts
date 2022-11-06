import { BoxSelectionComponent, BoxService } from '@/box-content/box';
import { Base, CircleLoaderComponent, observeSelectorsPassingValues, Selector } from '@/util';
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
    ],
    providers: [
        BoxService, // provided in root is not getting boxId route param right
    ],
})
export class BoxContentComponent extends Base {

    readonly loadingInProgress$: Selector<boolean> = this.boxService.loadingInProgress$;

    constructor(
        readonly boxService: BoxService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
