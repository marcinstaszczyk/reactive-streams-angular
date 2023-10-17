import { computed, Signal } from '@angular/core';

export function keepLastValue<T>(signal: Signal<T>): Signal<T> {
	let lastValue: T;
	return computed(() => {
		const value = signal();
		if (value === undefined) {
			return lastValue;
		} else {
			lastValue = value;
			return value;
		}
	});
}
