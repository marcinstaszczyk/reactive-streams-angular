import { CommonButtonsComponent } from '@/performance/core/CommonButtonsComponent';
import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	forwardRef,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
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
		CommonButtonsComponent,
	],
	providers: [
		{ provide: CommonTableComponent, useExisting: forwardRef(() => ValueByServiceSignalTableComponent)}
	],
})
export class ValueByServiceSignalTableComponent extends CommonTableComponent implements OnChanges, AfterViewInit {

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

	readonly trackBy = (index: number, item: WrappedValue | undefined) => item?.value;

    baseValue?: number = 1;

    table?: Array<WrappedValue | undefined>;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
		super()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['rowsCount']) {
            this.generateTable();
        }
    }

    ngAfterViewInit(): void {
        console.log('table.ngAfterViewInit');
    }

	protected override handleChangeValue(): void {
		this.baseValue = (this.baseValue ?? 0) + 1;
		this.generateTable();
		this.changeDetectorRef.detectChanges();
	}

	protected override handleResetValue(): void {
		this.baseValue = undefined;
		this.generateTable();
		this.changeDetectorRef.detectChanges();
	}

	private generateTable(): void {
        this.table = Array.from({ length: this.rowsCount ?? 0 }, (_, i) => {
            return this.baseValue ? new WrappedValue('' + (this.baseValue + i)) : undefined;
        });
    }

}
