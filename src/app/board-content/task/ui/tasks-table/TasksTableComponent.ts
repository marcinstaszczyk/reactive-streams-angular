import { Base, observeSelectorsPassingValues } from '@/util';
import { SignalResource } from '@/util/signals/signalResource';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskService } from '../../domain/TaskService';
import { TaskId } from '../../domain/types/TaskId';
import { TasksTableRowComponent } from '../tasks-table-row/TasksTableRowComponent';

@Component({
    selector: 'app-tasks-table',
    standalone: true,
    templateUrl: './TasksTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TasksTableRowComponent,
        ScrollingModule,
    ],
})
export class TasksTableComponent extends Base {

    readonly taskIds: SignalResource<TaskId[]> = this.taskService.taskIds;

    constructor(
        readonly taskService: TaskService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
