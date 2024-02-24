import { WrappedValue } from '@/performance/core/WrappedValue';
import { ChangeDetectionStrategy, Component, input, Signal } from '@angular/core';

@Component({
	selector: 'app-value-by-signal-wrapper-depth-level',
	standalone: true,
	templateUrl: './ValueBySignalWrapperDepthLevelComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueBySignalWrapperDepthLevelComponent {

	readonly depth$ = input.required<number>({ alias: 'depth' });

	readonly value$$ = input.required<Signal<WrappedValue>>({ alias: 'value$' });

}
