import { Base, combineProgress, observeSelectorsPassingValues, ResourceCache, State } from '@/util';
import { SelectorWithProgress } from '@/util/rxjs/selector/Selector';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { BoxRepository } from '../interfaces/BoxRepository';
import { Box } from '../types/Box';
import { BoxId } from '../types/BoxId';

@Injectable() // provided in root is not getting boxId route param right
export class BoxService extends Base {

    readonly currentBoxId$ = new State<BoxId>();
    readonly allBoxes$ = new ResourceCache<Box[]>(() => this.boxRepository.selectAllBoxes());

    // TODO reuse data between allBoxes and currentBox
    readonly currentBox$: SelectorWithProgress<Box> = this.currentBoxId$
        .asyncMapWithProgress((boxId: BoxId) => this.boxRepository.selectBoxData(boxId));

    readonly loadingInProgress$ = combineProgress(
        this.allBoxes$.inProgress$,
        this.currentBox$.inProgress$
    );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private boxRepository: BoxRepository
    ) {
        super();
        observeSelectorsPassingValues(this);

        this.currentBoxId$.connect(
            this.route.params.pipe(
                map((params: Params) => params['boxId']),
                filter((boxId: string | undefined): boxId is string => Boolean(boxId)),
                map((boxId: string) => BoxId.create(boxId))
            )
        );

    }

    userActionChangeBox(targetBox: BoxId): void {
        this.router.navigate(['box', targetBox.boxId]);
    }

}
