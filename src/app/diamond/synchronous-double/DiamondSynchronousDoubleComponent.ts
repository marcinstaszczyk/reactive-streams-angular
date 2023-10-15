import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { DiamondSynchronousDoubleService } from '@/diamond/synchronous-double/DiamondSynchronousDoubleService';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

@Component({
	selector: 'app-diamond-synchronous-double',
	templateUrl: './DiamondSynchronousDoubleComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
		RxPush,
	],
	providers: [
		DiamondSynchronousDoubleService,
	],
})
export class DiamondSynchronousDoubleComponent {

	constructor(
		readonly service: DiamondSynchronousDoubleService
	) {
	}

}
