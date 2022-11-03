import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { Base } from '../../util/angular/Base';
import { ResourceCache } from '../../util/cache/ResourceCache';
import { combineProgress } from '../../util/rxjs/selector/combineProgress';
import { observeSelectorsPassingValues } from '../../util/rxjs/selector/observeSelectorsPassingValues';
import { SelectorWithProgress } from '../../util/rxjs/selector/Selector';
import { State } from '../../util/state/State';
import { Box } from '../domain/Box';
import { BoxId } from '../domain/BoxId';
import { BoxRepository } from '../domain/BoxRepository';

@Injectable() // provided in root is not getting boxId route param right
export class BoxService extends Base {

    readonly currentBoxId$ = new State<BoxId>();
    readonly allBoxes$ = new ResourceCache<Box[]>(() => this.boxRepository.selectAllBoxes());

    // TODO reuse data between allBoxes and currentBox
    readonly currentBox$: SelectorWithProgress<Box> = this.currentBoxId$
        .asyncMapWithProgress((boxId: BoxId) => this.boxRepository.selectBoxData(boxId));

    readonly loadingInProgress$ = combineProgress(
        this.allBoxes$.selectLoadingInProgress$(),
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
