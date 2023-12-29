import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { combineProgress } from '@/util/signals/combineProgress';
import { toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { toLoading } from '@/util/signals/toLoading';
import { Injectable, Signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { BoardRepository } from './repositories/BoardRepository';
import { Board } from './types/Board';
import { BoardId } from './types/BoardId';

@Injectable() // provided in root is not getting boardId route param right
export class BoardService {

    readonly currentBoardId$: AsyncSignal<BoardId> = toAsyncSignal(() =>
        this.route.params.pipe(
            map((params: Params) => params['boardId']),
            filter((boardId: string | undefined): boardId is string => Boolean(boardId)),
            map((boardId: string) => BoardId.create(boardId)),
            // mergeWith(interval(1000).pipe(map((index) => BoardId.create('BOARD-' + (1 + index % 10)))))
        )
    );

    readonly allBoards$: AsyncSignal<Board[]> = toAsyncSignal(() => this.boardRepository.selectAllBoards());
    // TODO reuse data between allBoards and currentBoard
    readonly currentBoard$: AsyncSignal<Board> = toAsyncSignal(
        this.currentBoardId$,
        (boardId: BoardId) => this.boardRepository.selectBoardData(boardId)
    );

	readonly loadingInProgress$: Signal<boolean> = combineProgress(
		toLoading(this.allBoards$),
		toLoading(this.currentBoard$)
	);


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private boardRepository: BoardRepository
    ) {
    }

    userActionChangeBoard(targetBoard: BoardId): void {
        this.router.navigate(['board', targetBoard.boardId]);
    }

}
