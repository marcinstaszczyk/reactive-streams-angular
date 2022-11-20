import { Base, combineProgress, observeSelectorsPassingValues, ResourceCache, SelectorWithProgress, State } from '@/util';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { BoardRepository } from '../repositories/BoardRepository';
import { Board } from '../types/Board';
import { BoardId } from '../types/BoardId';

@Injectable() // provided in root is not getting boardId route param right
export class BoardService extends Base {

    readonly currentBoardId$ = new State<BoardId>();
    readonly allBoards$ = new ResourceCache<Board[]>(() => this.boardRepository.selectAllBoards());

    // TODO reuse data between allBoards and currentBoard
    readonly currentBoard$: SelectorWithProgress<Board> = this.currentBoardId$
        .asyncMapWithProgress((boardId: BoardId) => this.boardRepository.selectBoardData(boardId));

    readonly loadingInProgress$ = combineProgress(
        this.allBoards$.inProgress$,
        this.currentBoard$.inProgress$
    );

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private boardRepository: BoardRepository
    ) {
        super();
        observeSelectorsPassingValues(this);

        this.currentBoardId$.connect(
            this.route.params.pipe(
                map((params: Params) => params['boardId']),
                filter((boardId: string | undefined): boardId is string => Boolean(boardId)),
                map((boardId: string) => BoardId.create(boardId))
            )
        );

    }

    userActionChangeBoard(targetBoard: BoardId): void {
        this.router.navigate(['board', targetBoard.boardId]);
    }

}
