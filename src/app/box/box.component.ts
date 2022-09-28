import { Component } from '@angular/core';
import { BoxService } from './services/box.service';
import { Observable } from 'rxjs';
import { BoxId } from './domain/BoxId';
import { Selector } from '../util/decorators/Selector';
import { LetModule } from '@ngrx/component';
import { Box } from './domain/Box';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-box',
    standalone: true,
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss'],
    imports: [
        LetModule,
        CommonModule,
    ],
    providers: [
        BoxService, // provided in root is not getting boxId route param right
    ],
})
export class BoxComponent {

    constructor(
        private boxService: BoxService,
    ) {
    }

    @Selector()
    selectBoxId$(): Observable<BoxId> {
        return this.boxService.selectBoxId$()
    }

    @Selector()
    selectAllBoxes$(): Observable<Box[]> {
        return this.boxService.selectAllBoxes$();
    }

}
