import { Box } from './Box';
import { BoxId } from './BoxId';
import { Single } from '../../util/rxjs/Single';

export interface BoxRepository {
    selectBoxData(box: BoxId): Single<Box>;
}
