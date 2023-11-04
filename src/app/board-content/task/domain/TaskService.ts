import { BoardId, BoardService } from '@/board-content/board';
import { Task } from '@/board-content/task/domain/types/Task';
import { TaskId } from '@/board-content/task/domain/types/TaskId';
import { Single } from '@/util';
import { SignalResource, signalResource } from '@/util/signals/signalResource';
import { Injectable, Signal } from '@angular/core';
import { map } from 'rxjs';
import { TaskRepository } from './repositories/TaskRepository';

@Injectable()
export class TaskService {

    readonly currentBoardId: Signal<BoardId | undefined> = this.boardService.currentBoardId;
    readonly taskIds: SignalResource<TaskId[]> = signalResource(
        this.currentBoardId,
        (boardId: BoardId) => this.taskRepository.selectTaskIds(boardId)
    );

    constructor(
        private readonly boardService: BoardService,
        private readonly taskRepository: TaskRepository,
    ) {
    }

    selectTasks(taskIds: TaskId[]): Single<Task[]> {
        return this.taskRepository.selectTasks(taskIds);
    }

    selectTask(taskId: TaskId): Single<Task> {
        return Single.from(this.taskRepository.selectTasks([taskId]).pipe(
            map((tasks: Task[]) => tasks[0]!)
        ));
    }

}
