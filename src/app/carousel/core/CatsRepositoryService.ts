import { Injectable } from '@angular/core';
import { defer, delay, of } from 'rxjs';
import { Single } from '../../util/rxjs/Single';
import { HttpCat } from './HttpCat';

@Injectable({ providedIn: 'root' })
export class CatsRepositoryService {

    selectCats$(): Single<HttpCat[]> {
        return Single.from(defer(() => {
            console.count(`fetching cats...`);

            const statuses = [
                100, 101, 102,
                200, 201, 202, 203, 204, 206, 207,
                300, 301,
            ];

            const cats = statuses.map((status) => new HttpCat(status));

            return of(cats).pipe(
                delay(1000),
            );
        }));
    }
}
