import { DiamondAsynchronousService } from '@/diamond/asynchronous/DiamondAsynchronousService';
import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-diamond-asynchronous',
	templateUrl: './DiamondAsynchronousComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
		AsyncPipe,
	],
	providers: [
		DiamondAsynchronousService,
	],
})
export class DiamondAsynchronousComponent {

	constructor(
		readonly service: DiamondAsynchronousService
	) {
	}

}
