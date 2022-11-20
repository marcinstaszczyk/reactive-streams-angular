import { BoardId } from '@/board-content/board';
import { Task } from '@/board-content/task/domain/types/Task';
import { TaskId } from '@/board-content/task/domain/types/TaskId';
import { TaskRepositoryImpl } from '@/board-content/task/infrastructure/TaskRepositoryImpl';
import { Single } from '@/util';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root', useClass: TaskRepositoryImpl }) // FIXME: domain -> infrastructure dependency
export abstract class TaskRepository {

    abstract selectTaskIds(boardId: BoardId): Single<TaskId[]>;

    abstract selectTasks(taskIds: TaskId[]): Single<Task[]>;

}
