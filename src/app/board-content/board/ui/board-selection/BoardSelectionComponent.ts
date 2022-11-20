import { Base, observeSelectorsPassingValues, Selector, State } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@rx-angular/template';
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
        LetModule,
        PushModule,
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
