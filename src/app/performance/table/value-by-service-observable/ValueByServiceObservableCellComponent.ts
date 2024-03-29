import { WrappedValue } from '@/performance/core/WrappedValue';
import { Base } from '@/util';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { Observable, takeUntil } from 'rxjs';
import { ValueService } from './ValueService';

@Component({
    selector: 'app-value-by-service-observable-cell',
    standalone: true,
    templateUrl: './ValueByServiceObservableCellComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxPush,
    ],
})
export class ValueByServiceObservableCellComponent extends Base implements OnInit {

    value$: Observable<WrappedValue | undefined> = this.valueService.value$;

    value?: WrappedValue;

    constructor(
        private readonly valueService: ValueService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit(): void {
        this.value$.pipe(
            takeUntil(this.destroy$)
        ).subscribe((value?: WrappedValue) => {
            this.value = value;
            this.changeDetectorRef.detectChanges();
        });
    }

}
