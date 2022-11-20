import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { BoardId } from '../domain/types/BoardId';
import { MockHttpBoardResource } from './MockHttpBoardResource';
import { BoardDTO } from './types/BoardDTO';

@Injectable({ providedIn: 'root', useClass: MockHttpBoardResource })
export abstract class BoardResource {
    abstract selectBoardData(boardId: BoardId): Single<BoardDTO>;

    abstract selectAllBoards(): Single<BoardDTO[]>;
}
