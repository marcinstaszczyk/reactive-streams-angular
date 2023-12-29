import { AsyncSignal, NOT_LOADED } from '@/util/signals/AsyncSignal';
import { computed, Signal } from '@angular/core';

export function toLoading(asyncSignal: AsyncSignal<unknown>): Signal<boolean> {
	return computed(() => asyncSignal() === NOT_LOADED);
}
