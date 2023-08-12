import { signalResource, SignalResource } from '@/util/signals/signalResource';
import { computed, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, interval, map, mergeWith } from 'rxjs';
import { BoardRepository } from '../repositories/BoardRepository';
import { Board } from '../types/Board';
import { BoardId } from '../types/BoardId';

@Injectable() // provided in root is not getting boardId route param right
export class BoardService {

    readonly currentBoardId: Signal<BoardId | undefined> = toSignal(
        this.route.params.pipe(
            map((params: Params) => params['boardId']),
            filter((boardId: string | undefined): boardId is string => Boolean(boardId)),
            map((boardId: string) => BoardId.create(boardId)),
            mergeWith(interval(1000).pipe(map((index) => BoardId.create('BOARD-' + (1 + index % 10)))))
        )
    );
    readonly allBoards: SignalResource<Board[]> = signalResource(() => this.boardRepository.selectAllBoards());
    // TODO reuse data between allBoards and currentBoard
    readonly currentBoard: SignalResource<Board> = signalResource(
        this.currentBoardId,
        (boardId: BoardId) => this.boardRepository.selectBoardData(boardId)
    );

    readonly loadingInProgress: Signal<boolean> = computed(() => this.allBoards.loading() || this.currentBoard.loading());

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
