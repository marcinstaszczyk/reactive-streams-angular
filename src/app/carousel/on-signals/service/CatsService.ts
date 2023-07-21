import { Base, observeSelectorsPassingValues } from '@/util';
import { computed, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CatsRepositoryService } from '../../core/CatsRepositoryService';
import { HttpCat } from '../../core/HttpCat';

@Injectable()
export class CatsService extends Base {

    readonly cats: Signal<HttpCat[] | undefined> = toSignal(this.catsRepositoryService.selectCats$());
    readonly catIndex = signal(0);

    readonly cat: Signal<HttpCat | undefined> = computed(() => this.cats()?.[this.catIndex()]);

    readonly isReady: Signal<boolean> = computed(() => Boolean(this.cat()));

    readonly hasPreviousCat: Signal<boolean> = computed(() => this.catIndex() > 0);
    readonly hasNextCat: Signal<boolean> = computed(() => this.catIndex() + 1 < (this.cats()?.length ?? 0));

    constructor(
        private catsRepositoryService: CatsRepositoryService
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    nextCat() {
        this.catIndex.update((value: number) => value + 1);
    }

    previousCat() {
        this.catIndex.update((value: number) => value - 1);
    }

    firstCat() {
        this.catIndex.set(0);
    }

}
