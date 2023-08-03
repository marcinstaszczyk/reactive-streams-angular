import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { BoardId } from '../domain/types/BoardId';
import { BoardResource } from './BoardResource';
import { BoardDTO } from './types/BoardDTO';

@Injectable()
export class MockHttpBoardResource implements BoardResource {

    selectBoardData(boardId: BoardId): Single<BoardDTO> {
        console.log('selectBoardData', boardId);
        const boardDTO: BoardDTO = generateMockBoardDTO(boardId.boardId);
        return Single.from(
            of(boardDTO).pipe(
                delay(200)
            )
        );
    }

    selectAllBoards(): Single<BoardDTO[]> {
        console.log('selectAllBoards');
        const boardDTOs: BoardDTO[] = [1,2,3,4,5,6,7,8,9,10].map((boardId: number) => generateMockBoardDTO('BOARD-' + boardId));

        return Single.from(
            of(boardDTOs).pipe(
                delay(500)
            )
        );
    }

}

function generateMockBoardDTO(boardId: string): BoardDTO {
    return {
        id: boardId,
        name: "Generated board name " + boardId
    }
}
