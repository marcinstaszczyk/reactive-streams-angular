import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BoxRepository } from '../domain/repositories/BoxRepository';
import { Box } from '../domain/types/Box';
import { BoxId } from '../domain/types/BoxId';
import { BoxResource } from './BoxResource';
import { BoxDTO } from './types/BoxDTO';

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
