import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { Base } from '../../../util/angular/Base';
import { autoSubscribeAllSelectors } from '../../../util/rxjs/selector/autoSubscribeAllSelectors';
import { Selector } from '../../../util/rxjs/selector/Selector';
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
        autoSubscribeAllSelectors(this);
    }

}
