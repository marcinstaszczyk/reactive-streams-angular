import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Base } from '../util/angular/Base';
import { autoSubscribeAllSelectors } from '../util/rxjs/selector/autoSubscribeAllSelectors';
import { Selector } from '../util/rxjs/selector/Selector';
import { State } from '../util/state/State';
import { BoxService } from './services/BoxService';
import { BoxId } from './domain/BoxId';
import { LetModule, PushModule } from '@rx-angular/template';
import { Box } from './domain/Box';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CircleLoaderComponent } from '../util/ui/circle-loader/circle-loader.component';

@Component({
    selector: 'app-box',
    standalone: true,
    templateUrl: './BoxComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        LetModule,
        CommonModule,
        FormsModule,
        CircleLoaderComponent,
        PushModule,
    ],
    providers: [
        BoxService, // provided in root is not getting boxId route param right
    ],
})
export class BoxComponent extends Base {

    readonly selectNeverOpened$ = new State(true);

    readonly currentBoxId$: Selector<BoxId> = this.boxService.currentBoxId$;
    readonly currentBoxAsArray$: Selector<Box[]> = this.boxService.currentBox$.map((box: Box) => [box]);
    readonly loadingInProgress$: Selector<boolean> = this.boxService.loadingInProgress$;

    constructor(
        readonly boxService: BoxService,
    ) {
        super();
        autoSubscribeAllSelectors(this);
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
