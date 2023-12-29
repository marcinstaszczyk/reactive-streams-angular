import { AsyncSignal, NOT_LOADED } from '@/util/signals/AsyncSignal';
import { computed, Signal } from '@angular/core';

export function keepLastValue<T, I extends T | undefined = undefined>(
	signal: AsyncSignal<T>,
	initialValue?: I
): Signal<T | I> {
	let lastValue: T | I = initialValue as T | I;
	return computed(() => {
		const value: NOT_LOADED | T = signal();
		if (value === NOT_LOADED) {
			return lastValue;
		} else {
			lastValue = value;
			return value;
		}
	});
}
