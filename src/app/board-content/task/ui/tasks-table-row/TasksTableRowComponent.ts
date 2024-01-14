import { keepLastValue } from '@/util/signals/keepLastValue';
import { toAsyncSignal } from '@/util/signals/toAsyncSignal';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Signal } from '@angular/core';
import { TaskService } from '../../domain/TaskService';
import { Task } from '../../domain/types/Task';
import { TaskId } from '../../domain/types/TaskId';

@Component({
    selector: 'app-tasks-table-row[taskId]',
    standalone: true,
    templateUrl: './TasksTableRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
})
export class TasksTableRowComponent {

	readonly taskId$ = input.required<TaskId>({ alias: 'taskId' });

    readonly task$: Signal<Task | undefined> = keepLastValue(toAsyncSignal(
        this.taskId$,
        (taskId: TaskId) => this.taskService.selectTask(taskId)
    ));

    constructor(
        readonly taskService: TaskService,
    ) {
    }

}
