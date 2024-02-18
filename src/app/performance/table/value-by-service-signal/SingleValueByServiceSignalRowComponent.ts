import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ValueByServiceSignalCellComponent } from './ValueByServiceSignalCellComponent';

@Component({
    selector: 'app-single-value-by-service-signal-row',
    standalone: true,
    templateUrl: './ValueByServiceSignalRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ValueByServiceSignalCellComponent,
    ],
})
export class SingleValueByServiceSignalRowComponent implements OnChanges {

    @Input()
    columnsCount?: number;

    table?: number[];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columnsCount']) {
            this.table = Array.from({ length: this.columnsCount ?? 0 }, (_, i) => i);
        }
    }

}
