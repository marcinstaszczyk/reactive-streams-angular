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
import { RxPush } from '@rx-angular/template/push';
import { BehaviorSubject } from 'rxjs';
import { ValueByServiceObservableRowComponent } from './ValueByServiceObservableRowComponent';
import { ValueService } from './ValueService';
import { ValueServiceImpl } from './ValueServiceImpl';

@Component({
    selector: 'app-value-by-service-observable-table',
    standalone: true,
    templateUrl: './ValueByServiceObservableTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		RxPush,
		ScrollingModule,
		ValueByServiceObservableRowComponent,
		CommonButtonsComponent,
	],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
		{ provide: CommonTableComponent, useExisting: forwardRef(() => ValueByServiceObservableTableComponent)}
    ],
})
export class ValueByServiceObservableTableComponent extends CommonTableComponent implements OnChanges, AfterViewInit {

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

    value$ = new BehaviorSubject<WrappedValue | undefined>(new WrappedValue('1'));

    baseValue?: number = 1;

    table?: Array<WrappedValue | undefined>;

    constructor(
        private readonly valueServiceImpl: ValueServiceImpl,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
		super();
        valueServiceImpl.value$ = this.value$;
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
