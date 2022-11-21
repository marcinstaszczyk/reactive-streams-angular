import { Base, observeSelectorsPassingValues, ResourceCache, Selector, State } from '@/util';
import { Injectable } from '@angular/core';
import { CatsRepositoryService } from '../../core/CatsRepositoryService';
import { HttpCat } from '../../core/HttpCat';

@Injectable()
export class CatsService extends Base {

    readonly cats$ = new ResourceCache<HttpCat[]>(() => this.catsRepositoryService.selectCats$());
    readonly catIndex$ = new State(0);

    readonly cat$: Selector<HttpCat> = this.catIndex$.combineWith(
        this.cats$,
        (catIndex: number, cats: HttpCat[]) => cats[catIndex]!
    );
    readonly showNavigation$: Selector<boolean> = this.cats$.map(Boolean);
    readonly hasPrevious$: Selector<boolean> = this.catIndex$.map((index) => index > 0);
    readonly hasNext$: Selector<boolean> = this.catIndex$.combineWith(
        this.cats$,
        (catIndex: number, cats: HttpCat[]) => catIndex + 1 < cats.length
    );

    constructor(
        private catsRepositoryService: CatsRepositoryService
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    nextCat() {
        this.catIndex$.set((value: number) => value + 1);
    }

    previousCat() {
        this.catIndex$.set((value: number) => value - 1);
    }

    firstCat() {
        this.catIndex$.set(0);
    }

}
