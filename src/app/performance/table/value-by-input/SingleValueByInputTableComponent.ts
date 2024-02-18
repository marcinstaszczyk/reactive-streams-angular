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
		CommonButtonsComponent,
	],
	providers: [
		{ provide: CommonTableComponent, useExisting: forwardRef(() => SingleValueByInputTableComponent)}
	],
})
export class SingleValueByInputTableComponent extends CommonTableComponent implements OnChanges, AfterViewInit {

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

	readonly trackBy = (index: number) => index;

    value?: WrappedValue = new WrappedValue('1');

    table?: number[];

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
		super();
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
		this.value = new WrappedValue('' + (+(this.value?.value ?? 0) + 1));
		this.changeDetectorRef.detectChanges();
	}

	protected override handleResetValue(): void {
		this.value = undefined;
		this.changeDetectorRef.detectChanges();
	}

}
