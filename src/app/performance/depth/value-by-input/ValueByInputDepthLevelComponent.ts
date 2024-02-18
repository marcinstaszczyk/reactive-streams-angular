import { WrappedValue } from '@/performance/core/WrappedValue';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-value-by-input-depth-level',
	standalone: true,
	templateUrl: './ValueByInputDepthLevelComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueByInputDepthLevelComponent {

	@Input({ required: true })
	depth!: number;

	@Input({ required: true })
	value!: WrappedValue;

}
