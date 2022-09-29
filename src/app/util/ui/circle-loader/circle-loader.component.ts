import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-circle-loader',
    standalone: true,
    templateUrl: './circle-loader.component.html',
    styleUrls: ['./circle-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleLoaderComponent {
}
