import { Base, observeSelectorsPassingValues, Selector, State } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@rx-angular/template';
import { BoxService } from '../../domain/services/BoxService';
import { Box } from '../../domain/types/Box';
import { BoxId } from '../../domain/types/BoxId';

@Component({
    selector: 'app-box-selection',
    standalone: true,
    templateUrl: './BoxSelectionComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        LetModule,
        PushModule,
        FormsModule,
    ],
})
export class BoxSelectionComponent extends Base {

    readonly selectNeverOpened$ = new State(true);

    readonly currentBoxId$: Selector<BoxId> = this.boxService.currentBoxId$;
    readonly currentBoxAsArray$: Selector<Box[]> = this.boxService.currentBox$.map((box: Box) => [box]);

    readonly boxes$: Selector<Box[]> = this.selectNeverOpened$.asyncMap((selectNeverOpened: boolean) => {
        return selectNeverOpened ? this.currentBoxAsArray$ : this.boxService.allBoxes$;
    });

    constructor(
        readonly boxService: BoxService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    userActionBoxSelectionClicked(): void {
        this.selectNeverOpened$.set(false);
    }

    userActionChangeBox(boxId: BoxId): void {
        this.boxService.userActionChangeBox(boxId);
    }

    trackByBoxId(_: number, box: Box) {
        return box.id;
    }

}
