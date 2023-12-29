import { StyleDef } from '@/diamond/common/traffic-lights/StyleDef';
import { TrafficLightsResource } from '@/diamond/common/traffic-lights/TrafficLightsResource';
import { TrafficLightsState } from '@/diamond/common/traffic-lights/TrafficLightsState';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { keepLastValue } from '@/util/signals/keepLastValue';
import { safeComputed } from '@/util/signals/safeComputed';
import { toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { Injectable, Signal, signal } from '@angular/core';

@Injectable()
export class DiamondAsynchronousOnSignalsService {

	readonly state = signal<TrafficLightsState | undefined>(undefined);

	readonly position: AsyncSignal<number> = toAsyncSignal(
		this.state,
		(value: TrafficLightsState) => this.trafficLightsResource.selectPosition(value)
	);
	readonly positionStyle: AsyncSignal<StyleDef> = safeComputed(this.position, position => ({
		'margin-top': (20+70*position) + 'px'
	}));

	readonly borderStyle: AsyncSignal<StyleDef> = safeComputed(
		toAsyncSignal(
			this.state,
			(value: TrafficLightsState) => this.trafficLightsResource.selectBorderStyle(value)
		),
		(borderStyle: string) => ({
			'border-style': borderStyle,
			'border-width': '5px'
		})
	);

	readonly border: AsyncSignal<string> = toAsyncSignal(
		this.state,
		(value: TrafficLightsState) => this.trafficLightsResource.selectBorderColor(value)
	);
	readonly borderColor: AsyncSignal<StyleDef> = safeComputed(this.border, borderColor => ({
		'border-color': borderColor,
		'border-width': '5px'
	}));

	readonly color = toAsyncSignal(
		this.state,
		(value: TrafficLightsState) => this.trafficLightsResource.selectColor(value)
	);
	readonly colorStyle: AsyncSignal<StyleDef> = safeComputed(this.color, color => ({
		'background-color': color
	}));

	readonly resettableStyles: AsyncSignal<StyleDef> =
		safeComputed(
			this.positionStyle, this.borderStyle, this.borderColor, this.colorStyle,
			(position, borderStyle, borderColor, color) => {
				return {
					...color,
					...position,
					...borderColor,
					...borderStyle,
				};
			}
		);

	readonly styles: Signal<StyleDef | undefined> = keepLastValue(this.resettableStyles);

	constructor(
		private readonly trafficLightsResource: TrafficLightsResource
	) {
	}

	setState(value: TrafficLightsState): void {
		this.state.set(value);
	}

}
