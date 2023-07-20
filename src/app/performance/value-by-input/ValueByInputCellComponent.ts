import { WrappedValue } from '@/performance/core/WrappedValue';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

@Component({
    selector: 'app-value-by-input-cell',
    standalone: true,
    templateUrl: './ValueByInputCellComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RxPush,
    ],
})
export class ValueByInputCellComponent {

    @Input()
    value?: WrappedValue;

}
