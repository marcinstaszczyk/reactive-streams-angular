import { CommonButtonsComponent } from '@/performance/core/CommonButtonsComponent';
import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { WrappedValue } from '@/performance/core/WrappedValue';
import { ValueBySignalWrapperDepthLevelComponent } from '@/performance/depth/value-by-signal-wrapper/ValueBySignalWrapperDepthLevelComponent';
import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';

@Component({
	selector: 'app-value-by-signal-wrapper-depth',
	standalone: true,
	templateUrl: './ValueBySignalWrapperDepthComponent.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ValueBySignalWrapperDepthLevelComponent,
		CommonButtonsComponent,
	],
	providers: [
		{ provide: CommonTableComponent, useExisting: forwardRef(() => ValueBySignalWrapperDepthComponent)}
	],
})
export class ValueBySignalWrapperDepthComponent extends CommonTableComponent {

	readonly depth$ = input.required<number>({ alias: 'depth' });

	readonly depthRepeat$ = input.required<number>({ alias: 'depthRepeat' });
	readonly repeatArray$ = computed(() => Array.from({ length: this.depthRepeat$() }).fill(1));

	readonly render$ = signal(true);
	readonly value$$ = signal(signal<WrappedValue>(new WrappedValue('1'))).asReadonly();

	protected handleChangeValue(): void {
		this.render$.set(true);
		this.value$$().update(value => new WrappedValue('' + (+value.value + 1)));
	}

	protected handleResetValue(): void {
		this.render$.set(false);
		this.value$$().set(new WrappedValue('0'));
	}

}
