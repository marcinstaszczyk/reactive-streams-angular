import { DiamondAsynchronousOnSignalsService } from '@/diamond/asynchronous-on-signals/DiamondAsynchronousOnSignalsService';
import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-diamond-asynchronous-on-signals',
	templateUrl: './DiamondAsynchronousOnSignalsComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
	],
	providers: [
		DiamondAsynchronousOnSignalsService,
	],
})
export class DiamondAsynchronousOnSignalsComponent {

	constructor(
		readonly service: DiamondAsynchronousOnSignalsService
	) {
	}

}
