import { AsyncSignal, AsyncSignalContext } from '@/util/signals/AsyncSignal';
import { Signal } from '@angular/core';

export class AsyncSignalContextImpl implements AsyncSignalContext {

	constructor(
		private readonly value: any,
		private readonly asyncSignal$: Signal<any>,
		private readonly dependencies: Array<AsyncSignalContext>,
	) {
	}

	get<T>(asyncSignal$: AsyncSignal<T>): T | undefined {
		if (asyncSignal$ === this.asyncSignal$) {
			return this.value;
		}
		for (let i = 0; i < this.dependencies.length; i++) {
			const value = this.dependencies[i]!.get(asyncSignal$);
			if (value) {
				return value;
			}
		}
		return undefined;
	}
}
