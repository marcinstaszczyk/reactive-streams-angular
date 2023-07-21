import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { CatsService } from '../service/CatsService';

@Component({
    selector: 'app-carousel-navigation',
    standalone: true,
    imports: [NgIf],
    templateUrl: './CarouselNavigationComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselNavigationComponent {

    readonly showNavigation: Signal<boolean> = this.catsService.isReady;

    readonly hasPrevious: Signal<boolean> = this.catsService.hasPreviousCat;
    readonly hasNext: Signal<boolean> = this.catsService.hasNextCat;

    constructor(
        private catsService: CatsService
    ) {
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
