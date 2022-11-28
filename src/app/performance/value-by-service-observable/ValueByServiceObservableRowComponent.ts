import { ValueService } from '@/performance/value-by-service-observable/ValueService';
import { ValueServiceImpl } from '@/performance/value-by-service-observable/ValueServiceImpl';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { ReplaySubject } from 'rxjs';
import { WrappedValue } from '../core/WrappedValue';
import { ValueByServiceObservableCellComponent } from './ValueByServiceObservableCellComponent';

@Component({
    selector: 'app-value-by-service-observable-row',
    standalone: true,
    templateUrl: './ValueByServiceObservableRowComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
        ValueByServiceObservableCellComponent,
    ],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
    ],
})
export class ValueByServiceObservableRowComponent implements OnChanges {

    @Input()
    columnsCount?: number;

    @Input()
    value?: WrappedValue;

    readonly value$ = new ReplaySubject<WrappedValue | undefined>(1);

    table?: number[];

    constructor(
        private readonly valueServiceImpl: ValueServiceImpl,
    ) {
        valueServiceImpl.value$ = this.value$;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            this.value$.next(this.value);
        }
        if (changes['columnsCount']) {
            this.table = Array.from({ length: this.columnsCount ?? 0 }, (_, i) => i);
        }
    }

}
