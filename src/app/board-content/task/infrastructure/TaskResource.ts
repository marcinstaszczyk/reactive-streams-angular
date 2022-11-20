import { BoardId } from '@/board-content/board';
import { MockHttpTaskResource } from '@/board-content/task/infrastructure/MockHttpTaskResource';
import { TaskDTO } from '@/board-content/task/infrastructure/types/TaskDTO';
import { Single } from '@/util';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root', useClass: MockHttpTaskResource })
export abstract class TaskResource {

    abstract selectTaskIds(boardId: BoardId): Single<number[]>;

    abstract selectTasks(taskIds: number[]): Single<TaskDTO[]>;

}
