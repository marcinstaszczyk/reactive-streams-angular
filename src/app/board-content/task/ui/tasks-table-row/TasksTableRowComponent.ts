import { Base, Selector, State } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { TaskService } from '../../domain/services/TaskService';
import { Task } from '../../domain/types/Task';
import { TaskId } from '../../domain/types/TaskId';

@Component({
    selector: 'app-tasks-table-row[taskId]',
    standalone: true,
    templateUrl: './TasksTableRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxLet,
    ],
})
export class TasksTableRowComponent extends Base implements OnChanges {

    @Input()
    taskId!: TaskId;

    readonly taskId$ = new State<TaskId>();
    readonly task$: Selector<Task> = this.taskId$.asyncMap((taskId: TaskId) => {
        return this.taskService.selectTask(taskId);
    })

    constructor(
        readonly taskService: TaskService,
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['taskId']) {
            this.taskId$.set(this.taskId);
        }
    }

}
