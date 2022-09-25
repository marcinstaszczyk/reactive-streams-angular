import { getOrCreate } from '../../util/functions/getOrCreate';

export class BoxId {

    static boxIds = new Map<string, BoxId>();

    static create(boxId: string): BoxId {
        return getOrCreate(this.boxIds, boxId, () => new BoxId(boxId));
    }

    private constructor(
        readonly boxId: string
    ) {}

    toString(): string {
        return this.boxId;
    }
}
