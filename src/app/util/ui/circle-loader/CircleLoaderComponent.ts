import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-circle-loader',
    standalone: true,
    templateUrl: './CircleLoaderComponent.html',
    styleUrls: ['./CircleLoaderComponent.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleLoaderComponent {
}
