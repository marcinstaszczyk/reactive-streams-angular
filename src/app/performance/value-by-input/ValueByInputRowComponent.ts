import { WrappedValue } from '@/performance/core/WrappedValue';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { ValueByInputCellComponent } from './ValueByInputCellComponent';

@Component({
    selector: 'app-value-by-input-row',
    standalone: true,
    templateUrl: './ValueByInputRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
        ValueByInputCellComponent,
    ],
})
export class ValueByInputRowComponent implements OnChanges {

    @Input()
    columnsCount?: number;

    @Input()
    value?: WrappedValue;

    table?: number[];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columnsCount']) {
            this.table = Array.from({ length: this.columnsCount ?? 0 }, (_, i) => i);
        }
    }

}
