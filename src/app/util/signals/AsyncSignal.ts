import { Signal } from '@angular/core';

/**
 * Signal representing result of some asynchronous operation.
 * asyncSignal.ready() should be used to check if async operation is completed.
 * In many cases call for signal value (asyncSignal()), before signal is ready, will result in Error.
 */
export type AsyncSignal<T> = Signal<T> & {
    ready: Signal<boolean>
}
