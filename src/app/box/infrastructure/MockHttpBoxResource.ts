import { BoxResource } from './BoxResource';
import { Injectable } from '@angular/core';
import { Single } from '../../util/rxjs/Single';
import { BoxId } from '../domain/BoxId';
import { BoxDTO } from './types/BoxDTO';
import { delay, of } from 'rxjs';

@Injectable()
export class MockHttpBoxResource implements BoxResource {

    selectBoxData(boxId: BoxId): Single<BoxDTO> {
        const boxDTO: BoxDTO = generateMockBoxDTO(boxId.boxId);
        return Single.from(
            of(boxDTO).pipe(
                delay(200)
            )
        );
    }

    selectAllBoxes(): Single<BoxDTO[]> {
        const boxDTOs: BoxDTO[] = [1,2,3,4,5,6,7,8,9,10].map((boxId: number) => generateMockBoxDTO('BOX-' + boxId));

        return Single.from(
            of(boxDTOs).pipe(
                delay(500)
            )
        );
    }

}

function generateMockBoxDTO(boxId: string): BoxDTO {
    return {
        id: boxId,
        name: "Generated box name " + boxId
    }
}
