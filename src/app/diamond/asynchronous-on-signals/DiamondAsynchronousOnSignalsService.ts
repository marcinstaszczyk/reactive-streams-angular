import { StyleDef } from '@/diamond/common/traffic-lights/StyleDef';
import { TrafficLightsResource } from '@/diamond/common/traffic-lights/TrafficLightsResource';
import { TrafficLightsState } from '@/diamond/common/traffic-lights/TrafficLightsState';
import { keepLastValue } from '@/util/signals/keepLastValue';
import { safeComputed } from '@/util/signals/safeComputed';
import { signalResource } from '@/util/signals/signalResource';
import { Injectable, Signal, signal } from '@angular/core';

@Injectable()
export class DiamondAsynchronousOnSignalsService {

	readonly state = signal<TrafficLightsState | undefined>(undefined);

	readonly position = signalResource(
		this.state,
		(value: TrafficLightsState) => this.trafficLightsResource.selectPosition(value)
	);
	readonly positionStyle: Signal<StyleDef | undefined> = safeComputed(this.position, position => ({
		'margin-top': (20+70*position) + 'px'
	}));

	readonly borderStyle: Signal<StyleDef | undefined> = safeComputed(
		signalResource(
			this.state,
			(value: TrafficLightsState) => this.trafficLightsResource.selectBorderStyle(value)
		),
		(borderStyle: string) => ({
			'border-style': borderStyle,
			'border-width': '5px'
		})
	);

	readonly border = signalResource(
		this.state,
		(value: TrafficLightsState) => this.trafficLightsResource.selectBorderColor(value)
	);
	readonly borderColor: Signal<StyleDef | undefined> = safeComputed(this.border, borderColor => ({
		'border-color': borderColor,
		'border-width': '5px'
	}));

	readonly color = signalResource(
		this.state,
		(value: TrafficLightsState) => this.trafficLightsResource.selectColor(value)
	);
	readonly colorStyle: Signal<StyleDef | undefined> = safeComputed(this.color, color => ({
		'background-color': color
	}));

	readonly resettableStyles: Signal<StyleDef | undefined> =
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
