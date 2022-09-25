import { Observable, single } from 'rxjs';

export class Single<T> extends Observable<T> {

    static from<T>(source$: Observable<T>): Single<T> {
        const singleObs = new Single<T>();
        singleObs.source = source$.pipe(single());
        return singleObs;
    }

    protected constructor() {
        super();
    }

    /** @deprecated distinguishes Single from Observable for Typescript. Don't use */
    private isSingle(): boolean {
        return true;
    }

}
