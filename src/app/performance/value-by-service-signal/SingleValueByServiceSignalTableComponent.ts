import { CommonButtonsComponent } from '@/performance/core/CommonButtonsComponent';
import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
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
		CommonButtonsComponent,
	],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
		{ provide: CommonTableComponent, useExisting: forwardRef(() => SingleValueByServiceSignalTableComponent)}
    ],
})
export class SingleValueByServiceSignalTableComponent extends CommonTableComponent implements OnChanges, AfterViewInit {

    @Input()
    rowsCount?: number;

    @Input()
    columnsCount?: number;

    @Input()
    tableWidth?: number;

    @Input()
    tableHeight?: number;

    @ViewChild('scrollViewport', { read: ElementRef, static: true })
	override scrollViewport?: ElementRef;

    value$ = signal<WrappedValue | undefined>(new WrappedValue('1'));

    table?: number[];

    constructor(
        private readonly valueServiceImpl: ValueServiceImpl,
    ) {
		super();
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

	protected override handleChangeValue(): void {
		this.value$.set(new WrappedValue('' + (+(this.value$()?.value ?? 0) + 1)));
	}

	protected override handleResetValue(): void {
		this.value$.set(undefined);
	}

}
