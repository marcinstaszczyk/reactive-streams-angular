import { StyleDef } from '@/diamond/common/traffic-lights/StyleDef';
import { TrafficLightsResource } from '@/diamond/common/traffic-lights/TrafficLightsResource';
import { TrafficLightsState } from '@/diamond/common/traffic-lights/TrafficLightsState';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';

@Injectable()
export class DiamondAsynchronousService {

	private readonly stateSubject$ = new ReplaySubject<TrafficLightsState>(1);

	readonly state$: Observable<TrafficLightsState> = this.stateSubject$.asObservable();

	readonly position$: Observable<number> = this.state$.pipe(
		switchMap((value: TrafficLightsState) => this.trafficLightsResource.selectPosition(value)),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly positionStyle$: Observable<StyleDef> = this.position$.pipe(
		map(position => ({
			'margin-top': (20+70*position) + 'px'
		})),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly borderStyle$: Observable<StyleDef> = this.state$.pipe(
		switchMap((value: TrafficLightsState) => this.trafficLightsResource.selectBorderStyle(value)),
		map(borderStyle => ({
			'border-style': borderStyle,
			'border-width': '5px'
		})),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly borderColor$: Observable<StyleDef> = this.state$.pipe(
		switchMap((value: TrafficLightsState) => this.trafficLightsResource.selectBorderColor(value)),
		map(borderColor => ({
			'border-color': borderColor,
			'border-width': '5px'
		})),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly colorStyle$: Observable<StyleDef> = this.state$.pipe(
		switchMap((value: TrafficLightsState) => this.trafficLightsResource.selectColor(value)),
		map(color => ({
			'background-color': color
		})),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly styles$: Observable<any> =
		combineLatest([
			this.positionStyle$,
			this.borderStyle$,
			this.borderColor$,
			this.colorStyle$,
		]).pipe(
			map(([position, borderStyle, borderColor, color]) => {
				return {
					...position,
					...borderStyle,
					...borderColor,
					...color,
				};
			}),
			tap((value) => console.log('Styles computed. Result: ' + value)),
			shareReplay({ refCount: true, bufferSize: 1 }),
		);

	constructor(
		private readonly trafficLightsResource: TrafficLightsResource
	) {
	}

	setState(value: TrafficLightsState): void {
		this.stateSubject$.next(value);
	}

}
