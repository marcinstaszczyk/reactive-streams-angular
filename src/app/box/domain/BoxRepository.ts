import { Box } from './Box';
import { BoxId } from './BoxId';
import { Single } from '../../util/rxjs/Single';
import { Injectable } from '@angular/core';
import { BoxRepositoryImpl } from '../infrastructure/BoxRepositoryImpl';

@Injectable({ providedIn: 'root', useClass: BoxRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class BoxRepository {
    abstract selectBoxData(boxId: BoxId): Single<Box>;

    abstract selectAllBoxes(): Single<Box[]>;
}
