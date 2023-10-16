import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class DiamondSynchronousDoubleOnSignalsService {

	readonly value = signal(0);

	readonly doubleValue = computed(() => this.value() * 2);

	readonly three = signal(3)
	readonly tripleValue = computed(() => this.value() * this.three());

	readonly additionValue = computed(() => {
		const value = this.doubleValue() + this.tripleValue();
		console.log('Addition computed. Result: ' + value);
		return value;
	});

	readonly quintupleValue = computed(() => this.value() * 5);

	readonly equalityValue = computed(() => {
		const value = this.additionValue() === this.quintupleValue();
		console.log('Equality computed. Result: ' + value)
		return value;
	});

	setValue(value: number): void {
		this.value.set(value);
	}

	resendTripleValue(): void {
		this.three.set(3);
	}

}
