import { BoxId } from '@/box-content/box';
import { MockHttpTaskResource } from '@/box-content/task/infrastructure/MockHttpTaskResource';
import { TaskDTO } from '@/box-content/task/infrastructure/types/TaskDTO';
import { Single } from '@/util';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root', useClass: MockHttpTaskResource })
export abstract class TaskResource {

    abstract selectTaskIds(boxId: BoxId): Single<number[]>;

    abstract selectTasks(taskIds: number[]): Single<TaskDTO[]>;
    
}
