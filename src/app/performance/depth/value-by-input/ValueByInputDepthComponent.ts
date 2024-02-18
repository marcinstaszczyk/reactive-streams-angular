import { CommonButtonsComponent } from '@/performance/core/CommonButtonsComponent';
import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { WrappedValue } from '@/performance/core/WrappedValue';
import { ValueByInputDepthLevelComponent } from '@/performance/depth/value-by-input/ValueByInputDepthLevelComponent';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, forwardRef, input, Input } from '@angular/core';

@Component({
	selector: 'app-value-by-input-depth',
	standalone: true,
	templateUrl: './ValueByInputDepthComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ValueByInputDepthLevelComponent,
		CommonButtonsComponent,
	],
	providers: [
		{ provide: CommonTableComponent, useExisting: forwardRef(() => ValueByInputDepthComponent)}
	],
})
export class ValueByInputDepthComponent extends CommonTableComponent {

	@Input({ required: true })
	depth!: number;

	depthRepeat = input.required<number>();
	repeatArray = computed(() => Array.from({ length: this.depthRepeat() }).fill(1));


	value?: WrappedValue = new WrappedValue('1');

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		super();
	}

	protected handleChangeValue(): void {
		this.value = new WrappedValue('' + (+(this.value?.value ?? 0) + 1));
		this.changeDetectorRef.detectChanges();
	}

	protected handleResetValue(): void {
		this.value = undefined;
		this.changeDetectorRef.detectChanges();
	}

}
