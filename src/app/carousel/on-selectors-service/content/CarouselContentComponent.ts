import { Base, observeSelectorsPassingValues, Selector } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { HttpCat } from '../../core/HttpCat';
import { CatsService } from '../service/CatsService';

@Component({
    selector: 'app-carousel-content',
    standalone: true,
    imports: [CommonModule, PushModule],
    templateUrl: './CarouselContentComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselContentComponent extends Base {

    readonly cat$: Selector<HttpCat> = this.catsService.cat$;

    constructor(
        private catsService: CatsService
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
