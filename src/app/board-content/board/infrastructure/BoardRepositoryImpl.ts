import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BoardRepository } from '../domain/repositories/BoardRepository';
import { Board } from '../domain/types/Board';
import { BoardId } from '../domain/types/BoardId';
import { BoardResource } from './BoardResource';
import { BoardDTO } from './types/BoardDTO';

@Injectable()
export class BoardRepositoryImpl implements BoardRepository {

    constructor(
        private readonly boardResource: BoardResource
    ) {
    }

    selectBoardData(boardId: BoardId): Single<Board> {
        return Single.from(
            this.boardResource.selectBoardData(boardId).pipe(
                map((boardDTO: BoardDTO) => convertBoardDTOtoBoard(boardDTO))
            )
        )
    }

    selectAllBoards(): Single<Board[]> {
        return Single.from(
            this.boardResource.selectAllBoards().pipe(
                map((boardDTOs: BoardDTO[]) => {
                    return boardDTOs.map(convertBoardDTOtoBoard)
                })
            )
        )
    }

}

function convertBoardDTOtoBoard(boardDTO: BoardDTO): Board {
    const boardId: BoardId = BoardId.create(boardDTO.id);
    return new Board(boardId, boardDTO.name);
}
