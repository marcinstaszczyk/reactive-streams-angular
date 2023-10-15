import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { DiamondSynchronousDoubleOnSignalsService } from '@/diamond/synchronous-double-on-signals/DiamondSynchronousDoubleOnSignalsService';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-diamond-synchronous-double-on-signals',
	templateUrl: './DiamondSynchronousDoubleOnSignalsComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
	],
	providers: [
		DiamondSynchronousDoubleOnSignalsService,
	],
})
export class DiamondSynchronousDoubleOnSignalsComponent {

	constructor(
		readonly service: DiamondSynchronousDoubleOnSignalsService
	) {
	}

}
