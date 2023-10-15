import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-diamond-value-point',
	templateUrl: './DiamondValuePointComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule
	],
	host: {
		'style': 'display: block'
	}
})
export class DiamondValuePointComponent {

	@Input()
	value?: string | number;

}
