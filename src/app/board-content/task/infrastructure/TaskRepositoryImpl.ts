import { BoardId } from '@/board-content/board';
import { TaskRepository } from '@/board-content/task/domain/repositories/TaskRepository';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Task } from '../domain/types/Task';
import { TaskId } from '../domain/types/TaskId';
import { TaskResource } from './TaskResource';
import { TaskDTO } from './types/TaskDTO';

@Injectable()
export class TaskRepositoryImpl implements TaskRepository {

    constructor(
        private readonly taskResource: TaskResource
    ) {
    }

    selectTaskIds(boardId: BoardId): Single<TaskId[]> {
        return Single.from(
            this.taskResource.selectTaskIds(boardId).pipe(
                map((taskIds: number[]) => {
                    return taskIds.map((taskId: number) => TaskId.create(taskId));
                })
            )
        );
    }

    selectTasks(taskIds: TaskId[]): Single<Task[]> {
        const taskIdsAsStrings: number[] = taskIds.map((taskId: TaskId) => taskId.taskId);
        return Single.from(
            this.taskResource.selectTasks(taskIdsAsStrings).pipe(
                map((tasks: TaskDTO[]) => tasks.map(convertTaskDTOtoTask))
            )
        );
    }

}

function convertTaskDTOtoTask(taskDTO: TaskDTO): Task {
    return new Task({
        id: TaskId.create(taskDTO.id),
        name: taskDTO.name,
        completed: taskDTO.completed,
        description: taskDTO.description,
        assignee: taskDTO.assignee,
    });
}
