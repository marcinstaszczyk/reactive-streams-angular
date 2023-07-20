import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { ValueByInputRowComponent } from './ValueByInputRowComponent';

@Component({
    selector: 'app-single-value-by-input-table',
    standalone: true,
    templateUrl: './SingleValueByInputTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxPush,
        ValueByInputRowComponent,
        ScrollingModule,
    ],
})
export class SingleValueByInputTableComponent implements OnChanges, AfterViewInit {

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
        this.value = new WrappedValue('' + (+(this.value?.value ?? 0) + 1));
        const startTime = performance.now();
        this.changeDetectorRef.detectChanges();
        console.log('changeValue', performance.now() - startTime);
    }

    resetValue(): void {
        this.value = undefined;
        const startTime = performance.now();
        this.changeDetectorRef.detectChanges();
        console.log('changeValue', performance.now() - startTime);
    }

}
