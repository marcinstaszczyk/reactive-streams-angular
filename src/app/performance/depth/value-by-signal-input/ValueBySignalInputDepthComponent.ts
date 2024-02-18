import { CommonButtonsComponent } from '@/performance/core/CommonButtonsComponent';
import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { WrappedValue } from '@/performance/core/WrappedValue';
import { ValueBySignalInputDepthLevelComponent } from '@/performance/depth/value-by-signal-input/ValueBySignalInputDepthLevelComponent';
import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';

@Component({
	selector: 'app-value-by-signal-input-depth',
	standalone: true,
	templateUrl: './ValueBySignalInputDepthComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ValueBySignalInputDepthLevelComponent,
		CommonButtonsComponent,
	],
	providers: [
		{ provide: CommonTableComponent, useExisting: forwardRef(() => ValueBySignalInputDepthComponent)}
	],
})
export class ValueBySignalInputDepthComponent extends CommonTableComponent {

	readonly depth = input.required<number>();

	readonly depthRepeat = input.required<number>();
	readonly repeatArray = computed(() => Array.from({ length: this.depthRepeat() }).fill(1));

	readonly value = signal<WrappedValue | undefined>(new WrappedValue('1'));

	protected handleChangeValue(): void {
		this.value.update(value => new WrappedValue('' + (+(value?.value ?? 0) + 1)));
	}

	protected handleResetValue(): void {
		this.value.set(undefined);
	}

}
