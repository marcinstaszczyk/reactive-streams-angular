import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { DiamondSynchronousService } from '@/diamond/synchronous/DiamondSynchronousService';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

@Component({
	selector: 'app-diamond-synchronous',
	templateUrl: './DiamondSynchronousComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
		RxPush,
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
