import { Signal } from '@angular/core';

export const NOT_LOADED = Symbol('NOT_LOADED');
export type NOT_LOADED = typeof NOT_LOADED;

export type AsyncSignalState = Map<Signal<any>, unknown> | undefined;

/**
 * Signal representing result of some asynchronous (possibly lazy) operation.
 * asyncSignal() initially returns NOT_LOADED value until async operation is completed.
 */
export type AsyncSignal<T> = Signal<T | NOT_LOADED> & {
	state$: Signal<AsyncSignalState>,
	valueForState(state: AsyncSignalState): Exclude<T, NOT_LOADED>
};
