import { combineLatest, identity, map, Observable } from 'rxjs';

export function combineProgress(progress: Observable<boolean>[]): Observable<boolean> {
    return combineLatest(progress).pipe(
        map((progresses: boolean[]) => progresses.some(identity))
    );
}
