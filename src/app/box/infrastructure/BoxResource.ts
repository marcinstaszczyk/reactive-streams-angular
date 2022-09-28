import { BoxId } from '../domain/BoxId';
import { Single } from '../../util/rxjs/Single';
import { Injectable } from '@angular/core';
import { MockHttpBoxResource } from './MockHttpBoxResource';
import { BoxDTO } from './types/BoxDTO';

@Injectable({ providedIn: 'root', useClass: MockHttpBoxResource })
export abstract class BoxResource {
    abstract selectBoxData(boxId: BoxId): Single<BoxDTO>;

    abstract selectAllBoxes(): Single<BoxDTO[]>;
}
