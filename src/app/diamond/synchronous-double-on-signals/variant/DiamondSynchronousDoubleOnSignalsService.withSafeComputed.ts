import { safeComputed } from '@/util/signals/safeComputed';
import { Injectable, signal } from '@angular/core';

@Injectable()
export class DiamondSynchronousDoubleOnSignalsService {

	readonly value = signal<number | undefined>(undefined);

	readonly doubleValue = safeComputed(this.value, (value) => value * 2);

	readonly three = signal(3)
	readonly tripleValue = safeComputed(this.value, (value) => value * this.three());

	readonly additionValue = safeComputed(this.doubleValue, this.tripleValue, (doubleValue, tripleValue) => {
		const value = doubleValue + tripleValue;
		console.log('Addition computed. Result: ' + value);
		return value;
	});

	readonly quintupleValue = safeComputed(this.value, (value) => value * 5);

	readonly equalityValue = safeComputed(this.additionValue, this.quintupleValue, (additionValue, quintupleValue) => {
		const value = additionValue === quintupleValue;
		console.log('Equality computed. Result: ' + value);
		return value;
	});

	setValue(value: number): void {
		this.value.set(value);
	}

	resendTripleValue(): void {
		this.three.set(3);
	}

}
