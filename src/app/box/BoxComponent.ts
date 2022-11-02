import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BoxService } from './services/BoxService';
import { map, Observable } from 'rxjs';
import { BoxId } from './domain/BoxId';
import { Selector } from '../util/decorators/Selector';
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
export class BoxComponent {

    selectNeverOpened = true;

    constructor(
        private readonly boxService: BoxService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    @Selector()
    selectCurrentBoxId$(): Observable<BoxId> {
        return this.boxService.selectCurrentBoxId$()
    }

    @Selector()
    selectCurrentBoxAsArray$(): Observable<[Box]> {
        return this.boxService.selectCurrentBox$().pipe(
            map((box: Box) => [box])
        );
    }

    @Selector()
    selectAllBoxes$(): Observable<Box[]> {
        return this.boxService.selectAllBoxes$();
    }

    @Selector()
    selectLoadingInProgress$(): Observable<boolean> {
        return this.boxService.selectBoxesAreLoading$();
    }

    userActionBoxSelectionClicked(): void {
        this.selectNeverOpened = false;
        this.changeDetectorRef.detectChanges();
    }

    userActionChangeBox(boxId: BoxId): void {
        this.boxService.userActionChangeBox(boxId);
    }

    trackByBoxId(_: number, box: Box) {
        return box.id;
    }

}
