import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { DiamondSynchronousService } from '@/diamond/synchronous/DiamondSynchronousService';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-diamond-synchronous',
	templateUrl: './DiamondSynchronousComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
		AsyncPipe,
	],
	providers: [
		DiamondSynchronousService,
	],
})
export class DiamondSynchronousComponent {

	constructor(
		readonly service: DiamondSynchronousService
	) {
	}

}
