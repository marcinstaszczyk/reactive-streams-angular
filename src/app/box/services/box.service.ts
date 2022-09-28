import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { Selector } from '../../util/decorators/Selector';
import { BoxId } from '../domain/BoxId';
import { BoxRepository } from '../domain/BoxRepository';
import { ResourceCache } from '../../util/cache/ResourceCache';
import { Box } from '../domain/Box';

@Injectable() // provided in root is not getting boxId route param right
export class BoxService {

    private allBoxesCache = new ResourceCache(() => this.boxRepository.selectAllBoxes())

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private boxRepository: BoxRepository
    ) {
    }

    @Selector()
    selectBoxId$(): Observable<BoxId> {
        return this.route.params.pipe(
            map((params: Params) => params['boxId']),
            filter((boxId: string | undefined): boxId is string => Boolean(boxId)),
            map((boxId: string) => BoxId.create(boxId))
        );
    }

    // TODO selectBox$()

    @Selector()
    selectAllBoxes$(): Observable<Box[]> {
        return this.allBoxesCache.select$();
    }

    userActionChangeBox(targetBox: BoxId): void {
        this.router.navigate(['box', targetBox.boxId]);
    }

}
