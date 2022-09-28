import { BoxRepository } from '../domain/BoxRepository';
import { Single } from '../../util/rxjs/Single';
import { Box } from '../domain/Box';
import { BoxId } from '../domain/BoxId';
import { Injectable } from '@angular/core';
import { BoxResource } from './BoxResource';
import { BoxDTO } from './types/BoxDTO';
import { map } from 'rxjs/operators';

@Injectable()
export class BoxRepositoryImpl implements BoxRepository {

    constructor(
        private readonly boxResource: BoxResource
    ) {
    }

    selectBoxData(boxId: BoxId): Single<Box> {
        return Single.from(
            this.boxResource.selectBoxData(boxId).pipe(
                map((boxDTO: BoxDTO) => convertBoxDTOtoBox(boxDTO))
            )
        )
    }

    selectAllBoxes(): Single<Box[]> {
        return Single.from(
            this.boxResource.selectAllBoxes().pipe(
                map((boxDTOs: BoxDTO[]) => {
                    return boxDTOs.map(convertBoxDTOtoBox)
                })
            )
        )
    }

}

function convertBoxDTOtoBox(boxDTO: BoxDTO): Box {
    const boxId: BoxId = BoxId.create(boxDTO.id);
    return new Box(boxId, boxDTO.name);
}
