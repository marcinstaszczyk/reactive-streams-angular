import { BoardSelectionComponent, BoardService } from '@/board-content/board';
import { FiltersSelectionComponent, FiltersService } from '@/board-content/filters';
import { TaskService, TasksTableComponent } from '@/board-content/task';
import { Base, CircleLoaderComponent, combineProgress, observeSelectorsPassingValues, Selector } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
export class BoardContentComponent extends Base {

    readonly boardActive = signal(false);

    readonly loadingInProgress$: Selector<boolean> = combineProgress(
        this.boardService.loadingInProgress$,
        this.filtersService.loadingInProgress$
    );

    constructor(
        readonly boardService: BoardService,
        readonly filtersService: FiltersService,
    ) {
        super();
        observeSelectorsPassingValues(this);
    }

}
