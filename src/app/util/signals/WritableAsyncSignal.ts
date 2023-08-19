import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { WritableSignal } from '@angular/core';

export type WritableAsyncSignal<T, U = undefined> =
    AsyncSignal<T, U>
    & Omit<WritableSignal<T>, 'mutate' | 'asReadonly'>;
// Mutate is not working on computed(signal());
// asReadonly is it needed?
