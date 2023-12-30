import { StyleDef } from '@/diamond/common/traffic-lights/StyleDef';
import { NOT_LOADED } from '@/util/signals/AsyncSignal';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
export class DiamondValuePointComponent implements OnChanges {

	@Input()
	value?: string | number | boolean | null | NOT_LOADED;

	@Input()
	customStyle?: StyleDef | null | NOT_LOADED;

	@Input()
	sideValue?: string | number | boolean | null;

	customStyleDef?: StyleDef | null;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && this.value === NOT_LOADED) {
			this.value = null;
		}
		if (changes['customStyle']) {
			this.customStyleDef = (this.customStyle === NOT_LOADED) ? undefined : this.customStyle;
		}
	}

}
