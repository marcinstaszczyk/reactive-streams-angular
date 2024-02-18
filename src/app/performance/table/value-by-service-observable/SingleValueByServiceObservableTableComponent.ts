import { CommonButtonsComponent } from '@/performance/core/CommonButtonsComponent';
import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { WrappedValue } from '@/performance/core/WrappedValue';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { BehaviorSubject } from 'rxjs';
import { SingleValueByServiceObservableRowComponent } from './SingleValueByServiceObservableRowComponent';
import { ValueService } from './ValueService';
import { ValueServiceImpl } from './ValueServiceImpl';

@Component({
    selector: 'app-single-value-by-service-observable-table',
    standalone: true,
    templateUrl: './SingleValueByServiceObservableTableComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		RxPush,
		ScrollingModule,
		SingleValueByServiceObservableRowComponent,
		CommonButtonsComponent,
	],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
		{ provide: CommonTableComponent, useExisting: forwardRef(() => SingleValueByServiceObservableTableComponent)}
    ],
})
export class SingleValueByServiceObservableTableComponent extends CommonTableComponent implements OnChanges, AfterViewInit {

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

    value$ = new BehaviorSubject<WrappedValue | undefined>(new WrappedValue('1'));

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
		this.value$.next(new WrappedValue('' + (+(this.value$.value?.value ?? 0) + 1)));
	}

	protected override handleResetValue(): void {
		this.value$.next(undefined);
	}

}
