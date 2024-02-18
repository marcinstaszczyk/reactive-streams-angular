import { WrappedValue } from '@/performance/core/WrappedValue';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-value-by-signal-input-depth-level',
	standalone: true,
	templateUrl: './ValueBySignalInputDepthLevelComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueBySignalInputDepthLevelComponent {

	readonly depth = input.required<number>();

	readonly value = input.required<WrappedValue>();

}
