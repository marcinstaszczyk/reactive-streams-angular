import { Base, observeSelectorsPassingValues, Selector } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { CatsService } from '../service/CatsService';

@Component({
    selector: 'app-carousel-navigation',
    standalone: true,
    imports: [CommonModule, RxPush],
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
        observeSelectorsPassingValues(this);
    }

    next() {
        this.catsService.nextCat();
    }

    previous() {
        this.catsService.previousCat();
    }

    reset() {
        this.catsService.firstCat();
    }

}
