import { getOrCreate } from '@/util';

export class FilterId {

    static filterIds = new Map<string, FilterId>();

    static create(filterId: string): FilterId {
        return getOrCreate(this.filterIds, filterId, () => new FilterId(filterId));
    }

    private constructor(
        readonly filterId: string
    ) {}

    toString(): string {
        return this.filterId;
    }
}
