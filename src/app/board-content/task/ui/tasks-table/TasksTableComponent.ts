import { Base, observeSelectorsPassingValues } from '@/util';
import { AsyncSignal } from '@/util/signals/AsyncSignal';
import { keepLastValue } from '@/util/signals/keepLastValue';
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

    readonly taskIds$: AsyncSignal<TaskId[]> = keepLastValue(this.taskService.taskIds$);

	readonly trackBy = (index: number, item: any) => index;

    constructor(
        readonly taskService: TaskService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
