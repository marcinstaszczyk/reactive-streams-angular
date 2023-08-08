import { computed, CreateSignalOptions, signal, WritableSignal } from '@angular/core';

export function deferredSignal<T>(
    valueFactory: () => T,
    options?: CreateSignalOptions<T>
): WritableSignal<T> {
    let innerSignal: WritableSignal<T>;

    const lazySignal = computed(() => {
        if (!innerSignal) {
            innerSignal = signal(valueFactory(), options)
        }
        return innerSignal();
    });

    return Object.assign(lazySignal, {
        set: (value: T) => innerSignal.set(value),
        update: (updateFn: (value: T) => T) => innerSignal.update(updateFn),
        mutate: (mutateFn: (value: T) => void) => innerSignal.mutate(mutateFn),
        asReadonly: () => lazySignal
    })
}

