import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Base } from '../../util/angular/Base';
import { CarouselContentComponent } from './content/CarouselContentComponent';
import { CarouselNavigationComponent } from './navigation/CarouselNavigationComponent';
import { CatsService } from './service/CatsService';

@Component({
    selector: 'app-carousel-container',
    standalone: true,
    imports: [
        CarouselContentComponent,
        CarouselNavigationComponent
    ],
    templateUrl: './CarouselContainerComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        CatsService
    ],
})
export class CarouselContainerComponent extends Base {

}
