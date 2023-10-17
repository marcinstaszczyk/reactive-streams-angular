import { TrafficLightsState } from '@/diamond/common/traffic-lights/TrafficLightsState';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TrafficLightsResource {

	selectPosition(state: TrafficLightsState): Single<number> {
		return Single.from(
			of(this.getPosition(state))
		);
	}

	selectBorderStyle(state: TrafficLightsState): Single<string> {
		return Single.from(
			of(this.getBorderStyle(state)).pipe(
				delay(500)
			)
		);
	}

	selectBorderColor(state: TrafficLightsState): Single<string> {
		return Single.from(
			of(this.getBorderColor(state)).pipe(
				delay(1000)
			)
		);
	}

	selectColor(state: TrafficLightsState): Single<string> {
		return Single.from(
			of(this.getColor(state)).pipe(
				delay(1500)
			)
		);
	}


	private getPosition(state: TrafficLightsState): number {
		switch (state) {
			case 'stop': return 0;
			case 'warning': return 1;
			case 'ride': return 2;
		}
	}

	private getBorderStyle(state: TrafficLightsState): string {
		switch (state) {
			case 'stop': return 'solid';
			case 'warning': return 'dashed';
			case 'ride': return 'dotted';
		}
	}

	private getBorderColor(state: TrafficLightsState): string {
		switch (state) {
			case 'stop': return '#500';
			case 'warning': return '#530';
			case 'ride': return '#050';
		}
	}

	private getColor(state: TrafficLightsState): string {
		switch (state) {
			case 'stop': return 'red';
			case 'warning': return 'orange';
			case 'ride': return 'green';
		}
	}

}
