import { BoxService } from '@/box/box/domain/services/BoxService';
import { Box } from '@/box/box/domain/types/Box';
import { BoxId } from '@/box/box/domain/types/BoxId';
import { Base } from '@/util/angular/Base';
import { observeSelectorsPassingValues } from '@/util/rxjs/selector/observeSelectorsPassingValues';
import { Selector } from '@/util/rxjs/selector/Selector';
import { State } from '@/util/state/State';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@rx-angular/template';

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
