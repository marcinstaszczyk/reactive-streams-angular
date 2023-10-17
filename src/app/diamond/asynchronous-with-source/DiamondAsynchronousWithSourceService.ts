import { StyleDef } from '@/diamond/common/traffic-lights/StyleDef';
import { TrafficLightsResource } from '@/diamond/common/traffic-lights/TrafficLightsResource';
import { TrafficLightsState } from '@/diamond/common/traffic-lights/TrafficLightsState';
import { Injectable } from '@angular/core';
import { combineLatest, filter, map, Observable, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';

@Injectable()
export class DiamondAsynchronousWithSourceService {

	private readonly stateSubject$ = new ReplaySubject<TrafficLightsState>(1);

	readonly state$: Observable<TrafficLightsState> = this.stateSubject$.asObservable();

	readonly position$: Observable<readonly [number, TrafficLightsState]> = this.state$.pipe(
		switchMap((state: TrafficLightsState) =>
			this.trafficLightsResource.selectPosition(state).pipe(
				map(position => [position, state] as const)
			)
		),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly positionStyle$: Observable<readonly [StyleDef, TrafficLightsState]> = this.position$.pipe(
		map(([position, state]) => ([{
			'margin-top': (20+70*position) + 'px'
		}, state] as const)),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly borderStyle$: Observable<readonly [StyleDef, TrafficLightsState]> = this.state$.pipe(
		switchMap((state: TrafficLightsState) =>
			this.trafficLightsResource.selectBorderStyle(state).pipe(
				map(borderStyle => [borderStyle, state] as const)
			)
		),
		map(([borderStyle, state]) => ([{
			'border-style': borderStyle,
			'border-width': '5px'
		}, state] as const)),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly borderColor$: Observable<readonly [StyleDef, TrafficLightsState]> = this.state$.pipe(
		switchMap((state: TrafficLightsState) =>
			this.trafficLightsResource.selectBorderColor(state).pipe(
				map(borderColor => [borderColor, state] as const)
			)
		),
		map(([borderColor, state]) => ([{
			'border-color': borderColor,
			'border-width': '5px'
		}, state] as const)),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly colorStyle$: Observable<readonly [StyleDef, TrafficLightsState]> = this.state$.pipe(
		switchMap((state: TrafficLightsState) =>
			this.trafficLightsResource.selectColor(state).pipe(
				map(colorStyle => [colorStyle, state] as const)
			)
		),
		map(([borderColor, state]) => ([{
			'background-color': borderColor
		}, state] as const)),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly styles$: Observable<StyleDef> =
		combineLatest([
			this.positionStyle$,
			this.borderStyle$,
			this.borderColor$,
			this.colorStyle$,
		]).pipe(
			filter(([position, borderStyle, borderColor, color]) => {
				return position[1] === borderStyle[1] && position[1] === borderColor[1] && position[1] === color[1]
			}),
			map(([position, borderStyle, borderColor, color]) => {
				return {
					...position[0],
					...borderStyle[0],
					...borderColor[0],
					...color[0],
				};
			}),
			tap((value) => console.log('Styles computed.')),
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
