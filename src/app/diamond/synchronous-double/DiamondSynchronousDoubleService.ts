import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, ReplaySubject, shareReplay, switchMap, tap } from 'rxjs';

@Injectable()
export class DiamondSynchronousDoubleService {

	private readonly valueSubject$ = new ReplaySubject<number>(1);

	private readonly resendTripleSubject$ = new BehaviorSubject(void 0);


	readonly value$: Observable<number> = this.valueSubject$.asObservable();

	readonly doubleValue$: Observable<number> = this.value$.pipe(
		map(value => 2 * value),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly tripleValue$: Observable<number> = this.value$.pipe(
		map(value => 3 * value),
		switchMap((value) => this.resendTripleSubject$.pipe(map(() => value))),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly combiningFunction = combineLatest;
	readonly combiningFunctionName: string = this.combiningFunction.name;

	readonly additionValue$: Observable<number> =
		this.combiningFunction([
			this.doubleValue$,
			this.tripleValue$
		]).pipe(
			map(([value1, value2]) => value1 + value2),
			tap((value) => console.log('Addition computed. Result: ' + value)),
			shareReplay({ refCount: true, bufferSize: 1 }),
		);

	readonly quintupleValue$: Observable<number> = this.value$.pipe(
		map(value => 5 * value),
		shareReplay({ refCount: true, bufferSize: 1 }),
	);

	readonly equalityValue$: Observable<boolean> =
		this.combiningFunction([
			this.additionValue$,
			this.quintupleValue$
		]).pipe(
			map(([value1, value2]) => value1 === value2),
			tap((value) => console.log('Equality computed. Result: ' + value)),
			shareReplay({ refCount: true, bufferSize: 1 }),
		);

	setValue(value: number): void {
		this.valueSubject$.next(value);
	}

	resendTripleValue(): void {
		this.resendTripleSubject$.next(void 0);
	}

}
