import { CommonTableComponent } from '@/performance/core/CommonTableComponent';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-common-buttons-component',
	template: `
		<div style="display: block; gap: 4px">
			<button (click)="commonButtonsComponent.changeValue()">Change value</button>
			<button (click)="commonButtonsComponent.resetValue()">Reset value</button>
			<button (click)="commonButtonsComponent.scrollToTop()">Scroll to top</button>
			<button (click)="commonButtonsComponent.scrollToBottom()">Scroll to bottom</button>
		</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonButtonsComponent {

	constructor(
		protected readonly commonButtonsComponent: CommonTableComponent
	) {
	}

}
