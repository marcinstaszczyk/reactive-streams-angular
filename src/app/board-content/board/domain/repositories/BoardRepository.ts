import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { BoardRepositoryImpl } from '../../infrastructure/BoardRepositoryImpl';
import { Board } from '../types/Board';
import { BoardId } from '../types/BoardId';

@Injectable({ providedIn: 'root', useClass: BoardRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class BoardRepository {
    abstract selectBoardData(boardId: BoardId): Single<Board>;

    abstract selectAllBoards(): Single<Board[]>;
}
