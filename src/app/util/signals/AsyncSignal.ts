import { Signal } from '@angular/core';

export const NOT_LOADED = Symbol('NOT_LOADED');
export type NOT_LOADED = typeof NOT_LOADED;

export type AsyncSignalContext = {
	get<T>(asyncSignal$: AsyncSignal<T>): T | undefined;
}

/**
 * Signal representing result of some asynchronous (possibly lazy) operation.
 * asyncSignal() initially returns NOT_LOADED value until async operation is completed.
 */
export type AsyncSignal<T> = Signal<T | NOT_LOADED> & {
	/** Returns true if AsyncSignal value !== NOT_LOADED. Querying this property is not triggering underlying AsyncSignal operation. */
	loading$: Signal<boolean>,

	context$: Signal<AsyncSignalContext>,
};
