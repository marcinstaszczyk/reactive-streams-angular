import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { BoxRepositoryImpl } from '../../infrastructure/BoxRepositoryImpl';
import { Box } from '../types/Box';
import { BoxId } from '../types/BoxId';

@Injectable({ providedIn: 'root', useClass: BoxRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class BoxRepository {
    abstract selectBoxData(boxId: BoxId): Single<Box>;

    abstract selectAllBoxes(): Single<Box[]>;
}
