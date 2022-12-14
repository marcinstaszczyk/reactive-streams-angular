import { SingleValueByInputTableComponent } from '@/performance/value-by-input/SingleValueByInputTableComponent';
import { SingleValueByServiceObservableTableComponent } from '@/performance/value-by-service-observable/SingleValueByServiceObservableTableComponent';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { Configuration } from './core/Configuration';
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
        SingleValueByServiceObservableTableComponent,
        SingleValueByInputTableComponent,
    ],
})
export class PerformanceComponent {

    constructor(
        readonly configuration: Configuration
    ) {
    }

}
