import { WrappedValue } from '@/performance/core/WrappedValue';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ValueService } from './ValueService';

@Component({
    selector: 'app-value-by-service-signal-cell',
    standalone: true,
    templateUrl: './ValueByServiceSignalCellComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
})
export class ValueByServiceSignalCellComponent {

    value$: Signal<WrappedValue | undefined> = this.valueService.value$;

    constructor(
        private readonly valueService: ValueService,
    ) {
    }

}
