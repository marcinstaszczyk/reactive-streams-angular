import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template';
import { CatsRepositoryService } from '../core/CatsRepositoryService';
import { HttpCat } from '../core/HttpCat';
import { Base } from '../../util/angular/Base';
import { ResourceCache } from '../../util/cache/ResourceCache';
import { autoSubscribeAllSelectors } from '../../util/rxjs/selector/autoSubscribeAllSelectors';
import { Selector } from '../../util/rxjs/selector/Selector';
import { State } from '../../util/state/State';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule, PushModule],
    providers: [CatsRepositoryService],
    templateUrl: './CarouselOnSelectorsComponent.html',
    styleUrls: ['./CarouselOnSelectorsComponent.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselOnSelectorsComponent extends Base {

    readonly cats$ = new ResourceCache(() => this.catsRepositoryService.selectCats$());
    readonly catIndex$ = new State(0);

    readonly cat$: Selector<HttpCat> = this.catIndex$.combineWith(
        this.cats$,
        (catIndex: number, cats: HttpCat[]) => cats[catIndex]!
    );
    readonly hasPrevious$: Selector<boolean> = this.catIndex$.map((index) => {
        console.count('compute hasPrevious...');
        return index > 0;
    });
    readonly hasNext$: Selector<boolean> = this.catIndex$.combineWith(
        this.cats$,
        (catIndex: number, cats: HttpCat[]) => {
            console.count('compute hasNext...');
            return catIndex + 1 < cats.length;
        }
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
