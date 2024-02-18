import { ValueByInputDepthComponent } from '@/performance/depth/value-by-input/ValueByInputDepthComponent';
import { ValueBySignalInputDepthComponent } from '@/performance/depth/value-by-signal-input/ValueBySignalInputDepthComponent';
import { SingleValueByInputTableComponent } from '@/performance/table/value-by-input/SingleValueByInputTableComponent';
import { ValueByInputTableComponent } from '@/performance/table/value-by-input/ValueByInputTableComponent';
import { SingleValueByServiceObservableTableComponent } from '@/performance/table/value-by-service-observable/SingleValueByServiceObservableTableComponent';
import { ValueByServiceObservableTableComponent } from '@/performance/table/value-by-service-observable/ValueByServiceObservableTableComponent';
import { SingleValueByServiceSignalTableComponent } from '@/performance/table/value-by-service-signal/SingleValueByServiceSignalTableComponent';
import { ValueByServiceSignalTableComponent } from '@/performance/table/value-by-service-signal/ValueByServiceSignalTableComponent';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { Configuration } from './core/Configuration';

@Component({
    selector: 'app-performance',
    standalone: true,
    templateUrl: './PerformanceComponent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		RxPush,
		ValueByInputTableComponent,
		ValueByServiceObservableTableComponent,
		SingleValueByServiceObservableTableComponent,
		SingleValueByInputTableComponent,
		ValueByServiceSignalTableComponent,
		SingleValueByServiceSignalTableComponent,
		ValueByInputDepthComponent,
		ValueBySignalInputDepthComponent,
	],
})
export class PerformanceComponent {

    constructor(
        readonly configuration: Configuration
    ) {
    }

}
