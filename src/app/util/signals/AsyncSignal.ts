import { Signal } from '@angular/core';

/**
 * Signal representing result of some asynchronous operation.
 * asyncSignal() returns initial value (usually undefined) until async operation is completed.
 */
export type AsyncSignal<T, U = undefined> = Signal<T | U>;
// TODO should AsyncSignal have loading$
