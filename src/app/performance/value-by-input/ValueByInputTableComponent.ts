import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { ValueByInputRowComponent } from './ValueByInputRowComponent';

@Component({
    selector: 'app-value-by-input-table',
    standalone: true,
    templateUrl: './ValueByInputTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
        ValueByInputRowComponent,
        ScrollingModule,
    ],
})
export class ValueByInputTableComponent implements OnChanges, AfterViewInit {

    @Input()
    rowsCount?: number;

    @Input()
    columnsCount?: number;

    value?: WrappedValue = new WrappedValue('1');

    table?: number[];

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['rowsCount']) {
            this.table = Array.from({ length: this.rowsCount ?? 0 }, (_, i) => i);
        }
    }

    ngAfterViewInit(): void {
        console.log('table.ngAfterViewInit');
    }

    changeValue(): void {
        const startTime = performance.now();
        this.value = new WrappedValue('' + (+(this.value?.value ?? 0) + 1));
        this.changeDetectorRef.detectChanges();
        console.log('changeValue', performance.now() - startTime);
    }

    resetValue(): void {
        const startTime = performance.now();
        this.value = undefined;
        this.changeDetectorRef.detectChanges();
        console.log('changeValue', performance.now() - startTime);
    }

}
