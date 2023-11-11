import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { WritableSignal } from '@angular/core';

export type WritableAsyncSignal<T, U = undefined> =
    AsyncSignal<T, U>
    & Pick<WritableSignal<T>, 'set' | 'update'>
	& Pick<WritableSignal<T | U>, 'asReadonly'>;
// Mutate is not working on computed(signal());
