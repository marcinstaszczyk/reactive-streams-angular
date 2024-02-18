import { WrappedValue } from '@/performance/core/WrappedValue';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ValueByServiceSignalCellComponent } from './ValueByServiceSignalCellComponent';
import { ValueService } from './ValueService';
import { ValueServiceImpl } from './ValueServiceImpl';

@Component({
    selector: 'app-value-by-service-signal-row',
    standalone: true,
    templateUrl: './ValueByServiceSignalRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ValueByServiceSignalCellComponent,
    ],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
    ],
})
export class ValueByServiceSignalRowComponent implements OnChanges {

    @Input()
    columnsCount?: number;

    @Input()
    value?: WrappedValue;

    readonly value$ = signal<WrappedValue | undefined>(undefined);

    table?: number[];

    constructor(
        private readonly valueServiceImpl: ValueServiceImpl,
    ) {
        valueServiceImpl.value$ = this.value$;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            this.value$.set(this.value);
        }
        if (changes['columnsCount']) {
            this.table = Array.from({ length: this.columnsCount ?? 0 }, (_, i) => i);
        }
    }

}
