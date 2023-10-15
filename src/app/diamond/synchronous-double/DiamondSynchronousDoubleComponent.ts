import { DiamondValuePointComponent } from '@/diamond/common/value-point/DiamondValuePointComponent';
import { DiamondSynchronousDoubleService } from '@/diamond/synchronous-double/DiamondSynchronousDoubleService';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-diamond-synchronous-double',
	templateUrl: './DiamondSynchronousDoubleComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		DiamondValuePointComponent,
		AsyncPipe,
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
