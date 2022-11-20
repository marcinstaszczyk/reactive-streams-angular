import { BoardId } from '@/board-content/board';
import { TaskResource } from '@/board-content/task/infrastructure/TaskResource';
import { Single } from '@/util';
import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { TaskDTO } from './types/TaskDTO';

@Injectable()
export class MockHttpTaskResource implements TaskResource {

    selectTaskIds(boardId: BoardId): Single<number[]> {
        const taskIds: number[] = Array.from({ length: 100 }, (_, i) => i+1);

        return Single.from(
            of(taskIds).pipe(
                delay(400)
            )
        );
    }

    selectTasks(taskIds: number[]): Single<TaskDTO[]> {
        const filterDTOs: TaskDTO[] = taskIds.map((taskId: number) => generateMockTaskDTO(taskId));

        return Single.from(
            of(filterDTOs).pipe(
                delay(10 * taskIds.length)
            )
        );
    }

}

function generateMockTaskDTO(taskId: number): TaskDTO {
    return {
        id: taskId,
        name: `Task ${taskId}`,
        assignee: undefined,
        completed: false,
        description: undefined
    }
}
