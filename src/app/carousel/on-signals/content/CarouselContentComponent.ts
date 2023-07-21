import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { HttpCat } from '../../core/HttpCat';
import { CatsService } from '../service/CatsService';

@Component({
    selector: 'app-carousel-content',
    standalone: true,
    imports: [NgIf, NgOptimizedImage],
    templateUrl: './CarouselContentComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselContentComponent {

    readonly cat: Signal<HttpCat | undefined> = this.catsService.cat;

    constructor(
        private catsService: CatsService
    ) {
    }

}
