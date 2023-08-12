import { BoardSelectionComponent, BoardService } from '@/board-content/board';
import { FiltersSelectionComponent, FiltersService } from '@/board-content/filters';
import { TaskService, TasksTableComponent } from '@/board-content/task';
import { CircleLoaderComponent } from '@/util';
import { combineProgress } from '@/util/signals/combineProgress';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

@Component({
    selector: 'app-board',
    standalone: true,
    templateUrl: './BoardContentComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxPush,
        CircleLoaderComponent,
        BoardSelectionComponent,
        FiltersSelectionComponent,
        TasksTableComponent,
    ],
    providers: [
        BoardService, // provided in root is not getting boardId route param right
        FiltersService, // uses BoardService
        TaskService, // uses BoardService
    ],
})
export class BoardContentComponent {

    readonly boardActive = signal(false);

    readonly loadingInProgress: Signal<boolean> = combineProgress(
        this.boardService.loadingInProgress,
        this.filtersService.loadingInProgress
    );

    constructor(
        readonly boardService: BoardService,
        readonly filtersService: FiltersService,
    ) {
    }

}
