import { getOrCreate } from '@/util';

export class FilterId {

    static filterIds = new Map<string, FilterId>();

    static create(boxId: string): FilterId {
        return getOrCreate(this.filterIds, boxId, () => new FilterId(boxId));
    }

    private constructor(
        readonly filterId: string
    ) {}

    toString(): string {
        return this.filterId;
    }
}
