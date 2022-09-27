import { Component } from '@angular/core';
import { BoxService } from './services/box.service';
import { Observable } from 'rxjs';
import { BoxId } from './domain/BoxId';
import { Selector } from '../util/decorators/Selector';
import { LetModule } from '@ngrx/component';

@Component({
    selector: 'app-box',
    standalone: true,
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss'],
    imports: [
        LetModule,
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

}
