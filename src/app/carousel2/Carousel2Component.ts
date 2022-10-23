import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template';
import { BehaviorSubject } from 'rxjs';
import { CatsRepositoryService } from '../carousel/services/CatsRepositoryService';
import { HttpCat } from '../carousel/services/HttpCat';
import { ResourceCache } from '../util/cache/ResourceCache';
import { select, Selector } from '../util/rxjs/Selector';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule, PushModule],
    providers: [CatsRepositoryService],
    templateUrl: './Carousel2Component.html',
    styleUrls: ['./Carousel2Component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel2Component {

    readonly catsCache = new ResourceCache(() => this.catsRepositoryService.selectCats$());
    readonly catIndexState = new BehaviorSubject(0);

    // TODO logging
    readonly cats$: Selector<HttpCat[]> = this.catsCache.select$();
    readonly catIndex$: Selector<number> = select(this.catIndexState.asObservable());
    readonly cat$: Selector<HttpCat> = this.cats$.combineWith(
        this.catIndex$,
        (cats: HttpCat[], catIndex: number) => cats[catIndex]!
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
    }

    actionNext() {
        this.catIndexState.next(this.catIndexState.value + 1);
    }

    actionPrevious() {
        this.catIndexState.next(this.catIndexState.value - 1);
    }

    actionReset() {
        this.catIndexState.next(0);
    }

}
