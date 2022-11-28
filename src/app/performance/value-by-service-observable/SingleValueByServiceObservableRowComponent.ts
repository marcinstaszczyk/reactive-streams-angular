import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { ValueByServiceObservableCellComponent } from './ValueByServiceObservableCellComponent';

@Component({
    selector: 'app-single-value-by-service-observable-row',
    standalone: true,
    templateUrl: './ValueByServiceObservableRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
        ValueByServiceObservableCellComponent,
    ],
})
export class SingleValueByServiceObservableRowComponent implements OnChanges {

    @Input()
    columnsCount?: number;

    table?: number[];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columnsCount']) {
            this.table = Array.from({ length: this.columnsCount ?? 0 }, (_, i) => i);
        }
    }

}
