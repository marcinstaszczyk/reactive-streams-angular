import { Base, observeSelectorsPassingValues, Selector, State } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { BoardService } from '../../domain/services/BoardService';
import { Board } from '../../domain/types/Board';
import { BoardId } from '../../domain/types/BoardId';

@Component({
    selector: 'app-board-selection',
    standalone: true,
    templateUrl: './BoardSelectionComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxLet,
        RxPush,
        FormsModule,
    ],
})
export class BoardSelectionComponent extends Base {

    readonly selectNeverOpened$ = new State(true);

    readonly currentBoardId$: Selector<BoardId> = this.boardService.currentBoardId$;
    readonly currentBoardAsArray$: Selector<Board[]> = this.boardService.currentBoard$.map((board: Board) => [board]);

    readonly boards$: Selector<Board[]> = this.selectNeverOpened$.asyncMap((selectNeverOpened: boolean) => {
        return selectNeverOpened ? this.currentBoardAsArray$ : this.boardService.allBoards$;
    });

    constructor(
        readonly boardService: BoardService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

    userActionBoardSelectionClicked(): void {
        this.selectNeverOpened$.set(false);
    }

    userActionChangeBoard(boardId: BoardId): void {
        this.boardService.userActionChangeBoard(boardId);
    }

    trackByBoardId(_: number, board: Board) {
        return board.id;
    }

}
