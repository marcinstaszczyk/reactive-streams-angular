import { Base, observeSelectorsPassingValues, SelectorWithProgress } from '@/util';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { TaskService } from '../../domain/services/TaskService';
import { TaskId } from '../../domain/types/TaskId';
import { TasksTableRowComponent } from '../tasks-table-row/TasksTableRowComponent';

@Component({
    selector: 'app-tasks-table',
    standalone: true,
    templateUrl: './TasksTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxLet,
        TasksTableRowComponent,
        ScrollingModule,
    ],
})
export class TasksTableComponent extends Base {

    readonly taskIds$: SelectorWithProgress<TaskId[]> = this.taskService.taskIds$;

    constructor(
        readonly taskService: TaskService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
