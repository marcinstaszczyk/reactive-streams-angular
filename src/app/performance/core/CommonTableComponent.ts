import { Directive, ElementRef } from '@angular/core';

@Directive()
export abstract class CommonTableComponent {

	scrollViewport?: ElementRef;

    scrollToTop(): void {
        const startTime = performance.now();
        this.scrollViewport?.nativeElement.scrollTo(0, 0);
        setTimeout(() => {
            console.log('scrollToTop', performance.now() - startTime);
        })
    }

    scrollToBottom(): void {
        const startTime = performance.now();
        this.scrollViewport?.nativeElement.scrollTo(0, 10000);
        setTimeout(() => {
            console.log('scrollToBottom', performance.now() - startTime);
        })
    }

    changeValue(): void {
        const startTime = performance.now();
		this.handleChangeValue();
		requestIdleCallback(() => {
			console.log('changeValue', performance.now() - startTime);
		})
    }

    resetValue(): void {
        const startTime = performance.now();
		this.handleResetValue();
		requestIdleCallback(() => {
			console.log('resetValue', performance.now() - startTime);
		})
    }

	protected abstract handleChangeValue(): void;
	protected abstract handleResetValue(): void;

}
