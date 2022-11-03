import { combineLatest, identity, map } from 'rxjs';
import { select, Selector } from './Selector';

export function combineProgress(...progresses: Selector<boolean>[]): Selector<boolean> {
    return select(
        combineLatest(progresses).pipe(
            map((progresses: boolean[]) => progresses.some(identity))
        )
    );
}
