import { safeComputed } from '@/util/signals/safeComputed';
import { SignalResource } from '@/util/signals/signalResource';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core';
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
export class BoardSelectionComponent {

    readonly selectNeverOpened = signal(true);

    readonly currentBoardId: Signal<BoardId | undefined> = this.boardService.currentBoardId;
    readonly currentBoardAsArray: Signal<Board[] | undefined> = safeComputed(this.boardService.currentBoard, (board) => [board]);

    readonly allBoards: SignalResource<Board[]> = this.boardService.allBoards;

    readonly boards: Signal<Board[] | undefined> = computed(() => {
        return this.selectNeverOpened() ? this.currentBoardAsArray() : (this.allBoards());
    });

    constructor(
        readonly boardService: BoardService,
    ) {
    }

    userActionBoardSelectionClicked(): void {
        this.selectNeverOpened.set(false);
    }

    userActionChangeBoard(boardId: BoardId): void {
        this.boardService.userActionChangeBoard(boardId);
    }

    trackByBoardId(_: number, board: Board) {
        return board.id;
    }

}
