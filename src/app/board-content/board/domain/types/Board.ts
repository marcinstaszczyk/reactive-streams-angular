import { BoardId } from './BoardId';

export class Board {

    constructor(
        readonly id: BoardId,
        readonly name: string
    ) {
    }

}
