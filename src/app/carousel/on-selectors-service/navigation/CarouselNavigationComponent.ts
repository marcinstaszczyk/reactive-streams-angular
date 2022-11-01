import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { Base } from '../../../util/angular/Base';
import { autoSubscribeAllSelectors } from '../../../util/rxjs/selector/autoSubscribeAllSelectors';
import { Selector } from '../../../util/rxjs/selector/Selector';
import { CatsService } from '../service/CatsService';

@Component({
    selector: 'app-carousel-navigation',
    standalone: true,
    imports: [CommonModule, PushModule],
    templateUrl: './CarouselNavigationComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselNavigationComponent extends Base {

    readonly showNavigation$: Selector<boolean> = this.catsService.showNavigation$;

    readonly hasPrevious$: Selector<boolean> = this.catsService.hasPrevious$;
    readonly hasNext$: Selector<boolean> = this.catsService.hasNext$;

    constructor(
        private catsService: CatsService
    ) {
        super();
        autoSubscribeAllSelectors(this);
    }

    actionNext() {
        this.catsService.actionNext();
    }

    actionPrevious() {
        this.catsService.actionPrevious();
    }

    actionReset() {
        this.catsService.actionReset();
    }

}
