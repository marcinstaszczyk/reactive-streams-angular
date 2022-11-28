import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { BehaviorSubject } from 'rxjs';
import { WrappedValue } from '../core/WrappedValue';
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
        PushModule,
        ScrollingModule,
        SingleValueByServiceObservableRowComponent,
    ],
    providers: [
        ValueServiceImpl,
        { provide: ValueService, useExisting: ValueServiceImpl },
    ],
})
export class SingleValueByServiceObservableTableComponent implements OnChanges, AfterViewInit {

    @Input()
    rowsCount?: number;

    @Input()
    columnsCount?: number;

    value$ = new BehaviorSubject<WrappedValue | undefined>(new WrappedValue('1'));

    table?: number[];

    constructor(
        private readonly valueServiceImpl: ValueServiceImpl,
        private readonly changeDetectorRef: ChangeDetectorRef,
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

    changeValue(): void {
        const startTime = performance.now();
        this.value$.next(new WrappedValue('' + (+(this.value$.value?.value ?? 0) + 1)));
        this.changeDetectorRef.detectChanges();
        console.log('changeValue', performance.now() - startTime);
    }

    resetValue(): void {
        const startTime = performance.now();
        this.value$.next(undefined);
        this.changeDetectorRef.detectChanges();
        console.log('changeValue', performance.now() - startTime);
    }

}
