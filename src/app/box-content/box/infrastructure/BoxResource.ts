import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { BoxId } from '../domain/types/BoxId';
import { MockHttpBoxResource } from './MockHttpBoxResource';
import { BoxDTO } from './types/BoxDTO';

@Injectable({ providedIn: 'root', useClass: MockHttpBoxResource })
export abstract class BoxResource {
    abstract selectBoxData(boxId: BoxId): Single<BoxDTO>;

    abstract selectAllBoxes(): Single<BoxDTO[]>;
}
