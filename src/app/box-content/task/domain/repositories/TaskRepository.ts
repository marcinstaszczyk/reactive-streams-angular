import { BoxId } from '@/box-content/box';
import { Task } from '@/box-content/task/domain/types/Task';
import { TaskId } from '@/box-content/task/domain/types/TaskId';
import { TaskRepositoryImpl } from '@/box-content/task/infrastructure/TaskRepositoryImpl';
import { Single } from '@/util';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root', useClass: TaskRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class TaskRepository {

    abstract selectTaskIds(boxId: BoxId): Single<TaskId[]>;

    abstract selectTasks(taskIds: TaskId[]): Single<Task[]>;

}
