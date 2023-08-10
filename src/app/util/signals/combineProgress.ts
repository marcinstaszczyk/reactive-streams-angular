import { computed, Signal } from '@angular/core';

export function combineProgress(...progresses: Signal<boolean>[]): Signal<boolean> {
    return computed(() => {
        for (const progress of progresses) {
            if (progress()) {
                return true;
            }
        }
        return false;
    });
}
