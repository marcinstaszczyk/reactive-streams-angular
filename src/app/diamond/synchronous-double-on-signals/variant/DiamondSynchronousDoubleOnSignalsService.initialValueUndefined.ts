import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class DiamondSynchronousDoubleOnSignalsServiceInitialValueUndefined {

	readonly value = signal<number | undefined>(undefined);

	readonly doubleValue = computed(() => {
		const value = this.value();
		return value === undefined ? undefined : value * 2;
	});

	readonly three = signal(3)
	readonly tripleValue = computed(() => {
		const value = this.value();
		return value === undefined ? undefined : value * this.three();
	});

	readonly additionValue = computed(() => {
		const doubleValue: undefined | number = this.doubleValue();
		const tripleValue: undefined | number = this.tripleValue();
		const value = doubleValue === undefined || tripleValue === undefined
			? undefined
			: doubleValue + tripleValue;
		console.log('Addition computed. Result: ' + value);
		return value;
	});

	readonly quintupleValue = computed(() => {
		const value = this.value();
		return value === undefined ? undefined : value * 5;
	});

	readonly equalityValue = computed(() => {
		const additionValue: undefined | number = this.additionValue();
		const quintupleValue: undefined | number = this.quintupleValue();
		const value = additionValue === undefined || quintupleValue === undefined
			? undefined
			: additionValue === quintupleValue;
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
