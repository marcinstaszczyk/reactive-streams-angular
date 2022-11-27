import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { ValueByInputTableComponent } from './value-by-input/ValueByInputTableComponent';
import { ValueByServiceObservableTableComponent } from './value-by-service-observable/ValueByServiceObservableTableComponent';

@Component({
    selector: 'app-performance',
    standalone: true,
    templateUrl: './PerformanceComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        PushModule,
        ValueByInputTableComponent,
        ValueByServiceObservableTableComponent,
    ],
})
export class PerformanceComponent {

}
