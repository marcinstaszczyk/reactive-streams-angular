import { ResourceCache } from '@/util';
import { Selector } from '@/util/decorators/Selector';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { CatsRepositoryService } from '../core/CatsRepositoryService';
import { HttpCat } from '../core/HttpCat';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule, PushModule],
    templateUrl: './CarouselOnDecoratorsComponent.html',
    styleUrls: ['./CarouselOnDecoratorsComponent.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselOnDecoratorsComponent {

    readonly cats$ = new ResourceCache(() => this.catsRepositoryService.selectCats$());
    readonly catIndex$ = new BehaviorSubject(0);

    constructor(
        private catsRepositoryService: CatsRepositoryService
    ) {
    }

    @Selector()
    selectCatIndex$(): Observable<number> {
        return this.catIndex$.asObservable();
    }

    @Selector()
    selectCat$(): Observable<HttpCat> {
        return combineLatest([
            this.cats$.select$(),
            this.selectCatIndex$()
        ]).pipe(
            map(([cats, catIndex]) => cats[catIndex]!)
        );
    }

    @Selector()
    selectHasPrevious$(): Observable<boolean> {
        return this.selectCatIndex$().pipe(
            map((index) => {
                console.count('compute hasPrevious...');
                return index > 0;
            })
        )
    }

    @Selector()
    selectHasNext$(): Observable<boolean> {
        return combineLatest([
            this.cats$.select$(),
            this.selectCatIndex$()
        ]).pipe(
            map(([cats, catIndex]) => {
                console.count('compute hasNext...');
                return catIndex + 1 < cats.length;
            })
        );
    }

    actionNext() {
        this.catIndex$.next(this.catIndex$.value + 1);
    }

    actionPrevious() {
        this.catIndex$.next(this.catIndex$.value - 1);
    }

    actionReset() {
        this.catIndex$.next(0);
    }

}
