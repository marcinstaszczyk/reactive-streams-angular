import { Signal } from '@angular/core';

export const NOT_LOADED = Symbol('NOT_LOADED');
export type NOT_LOADED = typeof NOT_LOADED;

/**
 * Signal representing result of some asynchronous (possibly lazy) operation.
 * asyncSignal() initially returns NOT_LOADED value until async operation is completed.
 */
export type AsyncSignal<T> = Signal<T | NOT_LOADED>;
