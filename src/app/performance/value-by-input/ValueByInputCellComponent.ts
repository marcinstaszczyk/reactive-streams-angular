import { WrappedValue } from '@/performance/core/WrappedValue';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';

@Component({
    selector: 'app-value-by-input-cell',
    standalone: true,
    templateUrl: './ValueByInputCellComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
    ],
})
export class ValueByInputCellComponent {

    @Input()
    value?: WrappedValue;

}
