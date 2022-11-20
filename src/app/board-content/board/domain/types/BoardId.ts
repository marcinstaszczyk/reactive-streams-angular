import { getOrCreate } from '@/util';

export class BoardId {

    static boardIds = new Map<string, BoardId>();

    static create(boardId: string): BoardId {
        return getOrCreate(this.boardIds, boardId, () => new BoardId(boardId));
    }

    private constructor(
        readonly boardId: string
    ) {}

    toString(): string {
        return this.boardId;
    }
}
