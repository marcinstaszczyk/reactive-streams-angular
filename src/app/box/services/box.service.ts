import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { Selector } from '../../util/decorators/Selector';
import { BoxId } from '../domain/BoxId';

@Injectable() // provided in root is not getting boxId route param right
export class BoxService {

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    @Selector()
    selectBox$(): Observable<BoxId> {
        return this.route.params.pipe(
            map((params: Params) => params['boxId']),
            filter((boxId: string | undefined): boxId is string => Boolean(boxId)),
            map((boxId: string) => BoxId.create(boxId))
        );
    }

    userActionChangeBox(targetBox: BoxId): void {
        this.router.navigate(['box', targetBox.boxId]);
    }

}
