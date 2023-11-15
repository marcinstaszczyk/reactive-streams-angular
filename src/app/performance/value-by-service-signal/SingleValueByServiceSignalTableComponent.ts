import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { SingleValueByServiceSignalRowComponent } from './SingleValueByServiceSignalRowComponent';
import { ValueService } from './ValueService';
import { ValueServiceImpl } from './ValueServiceImpl';

@Component({
    selector: 'app-single-value-by-service-signal-table',
    standalone: true,
    templateUrl: './SingleValueByServiceSignalTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ScrollingModule,
        SingleValueByServiceSignalRowComponent,
    ],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
    ],
})
export class SingleValueByServiceSignalTableComponent implements OnChanges, AfterViewInit {

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

    value$ = signal<WrappedValue | undefined>(new WrappedValue('1'));

    table?: number[];

    constructor(
        private readonly valueServiceImpl: ValueServiceImpl,
    ) {
        valueServiceImpl.value$ = this.value$;
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
        const startTime = performance.now();
        this.value$.set(new WrappedValue('' + (+(this.value$()?.value ?? 0) + 1)));
		requestIdleCallback(() => {
			console.log('changeValue', performance.now() - startTime);
		})
    }

    resetValue(): void {
        const startTime = performance.now();
        this.value$.set(undefined);
		requestIdleCallback(() => {
			console.log('resetValue', performance.now() - startTime);
		})
    }

}
