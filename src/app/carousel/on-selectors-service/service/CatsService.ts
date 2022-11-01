import { Injectable } from '@angular/core';
import { Base } from '../../../util/angular/Base';
import { ResourceCache } from '../../../util/cache/ResourceCache';
import { autoSubscribeAllSelectors } from '../../../util/rxjs/selector/autoSubscribeAllSelectors';
import { Selector } from '../../../util/rxjs/selector/Selector';
import { State } from '../../../util/state/State';
import { CatsRepositoryService } from '../../core/CatsRepositoryService';
import { HttpCat } from '../../core/HttpCat';

@Injectable()
export class CatsService extends Base {

    readonly cats$ = new ResourceCache(() => this.catsRepositoryService.selectCats$());
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
        autoSubscribeAllSelectors(this);
    }

    actionNext() {
        this.catIndex$.set((value: number) => value + 1);
    }

    actionPrevious() {
        this.catIndex$.set((value: number) => value - 1);
    }

    actionReset() {
        this.catIndex$.set(0);
    }

}
