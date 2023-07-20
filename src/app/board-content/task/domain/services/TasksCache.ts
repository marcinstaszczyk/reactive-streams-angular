import { TaskRepository } from '@/board-content/task/domain/repositories/TaskRepository';
import { ItemsCache } from '@/util';
import { Injectable } from '@angular/core';
import { Task } from '../types/Task';
import { TaskId } from '../types/TaskId';

@Injectable({ providedIn: 'root' })
export class TasksCache extends ItemsCache<TaskId, Task> {

    constructor(
        taskRepository: TaskRepository
    ) {
        super(
            (taskIds: TaskId[]) => taskRepository.selectTasks(taskIds),
            (task: Task) => task.id
        );
    }

}
