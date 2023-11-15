import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ValueByServiceSignalRowComponent } from './ValueByServiceSignalRowComponent';

@Component({
    selector: 'app-value-by-service-signal-table',
    standalone: true,
    templateUrl: './ValueByServiceSignalTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ScrollingModule,
        ValueByServiceSignalRowComponent,
    ],
})
export class ValueByServiceSignalTableComponent implements OnChanges, AfterViewInit {

    @Input()
    rowsCount?: number;

    @Input()
    columnsCount?: number;

    @Input()
    tableWidth?: number;

    @Input()
    tableHeight?: number;

    @ViewChild('scrollViewport', { read: ElementRef, static: true })
    scrollViewport?: ElementRef;

    baseValue?: number = 1;

    table?: Array<WrappedValue | undefined>;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['rowsCount']) {
            this.generateTable();
        }
    }

    ngAfterViewInit(): void {
        console.log('table.ngAfterViewInit');
    }

    scrollToTop(): void {
        const startTime = performance.now();
        this.scrollViewport?.nativeElement.scrollTo(0, 0);
        setTimeout(() => {
            console.log('scrollToTop', performance.now() - startTime);
        })
    }

    scrollToBottom(): void {
        const startTime = performance.now();
        this.scrollViewport?.nativeElement.scrollTo(0, 10000);
        setTimeout(() => {
            console.log('scrollToBottom', performance.now() - startTime);
        })
    }

    changeValue(): void {
        this.baseValue = (this.baseValue ?? 0) + 1;
        this.generateTable();
        const startTime = performance.now();
        this.changeDetectorRef.detectChanges();
		requestIdleCallback(() => {
			console.log('changeValue', performance.now() - startTime);
		})
    }

    resetValue(): void {
        this.baseValue = undefined;
        this.generateTable();
        const startTime = performance.now();
        this.changeDetectorRef.detectChanges();
		requestIdleCallback(() => {
			console.log('resetValue', performance.now() - startTime);
		})
    }

    private generateTable(): void {
        this.table = Array.from({ length: this.rowsCount ?? 0 }, (_, i) => {
            return this.baseValue ? new WrappedValue('' + (this.baseValue + i)) : undefined;
        });
    }

}
