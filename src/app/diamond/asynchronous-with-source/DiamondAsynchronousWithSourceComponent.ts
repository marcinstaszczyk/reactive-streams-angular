import { DiamondAsynchronousWithSourceService } from '@/diamond/asynchronous-with-source/DiamondAsynchronousWithSourceService';
import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-diamond-asynchronous-with-source',
	templateUrl: './DiamondAsynchronousWithSourceComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
		AsyncPipe,
	],
	providers: [
		DiamondAsynchronousWithSourceService,
	],
})
export class DiamondAsynchronousWithSourceComponent {

	constructor(
		readonly service: DiamondAsynchronousWithSourceService
	) {
	}

}
