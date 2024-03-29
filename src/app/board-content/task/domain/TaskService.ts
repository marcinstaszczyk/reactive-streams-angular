import { BoardId, BoardService } from '@/board-content/board';
import { Task } from '@/board-content/task/domain/types/Task';
import { TaskId } from '@/board-content/task/domain/types/TaskId';
import { Single } from '@/util';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TaskRepository } from './repositories/TaskRepository';

@Injectable()
export class TaskService {

    readonly currentBoardId$: AsyncSignal<BoardId> = this.boardService.currentBoardId$;
    readonly taskIds$: AsyncSignal<TaskId[]> = toAsyncSignal(
        this.currentBoardId$,
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
