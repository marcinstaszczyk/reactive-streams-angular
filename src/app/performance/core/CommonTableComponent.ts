import { Directive, ElementRef } from '@angular/core';

@Directive()
export abstract class CommonTableComponent {

	scrollViewport?: ElementRef;

	readonly DEFAULT_REPEATS_COUNT = 100;

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

	changeValueManyTimes(iteration = 0, repeats = this.DEFAULT_REPEATS_COUNT, minTime = Number.MAX_VALUE, totalTime = 0): void {
		if (iteration === repeats) {
			console.log(`changeValueManyTimes. MIN: ${minTime}. AVG: ${totalTime / repeats}`);
			return;
		}
		const startTime = performance.now();
		this.handleChangeValue();
		requestIdleCallback(() => {
			const iterationTime: number = performance.now() - startTime;
			// console.log(iteration, iterationTime)
			this.changeValueManyTimes(iteration+1, repeats, Math.min(minTime, iterationTime), totalTime + iterationTime);
		});
		// setTimeout(() => {
		// 	console.log(iteration);
		// })
	}

	protected abstract handleChangeValue(): void;
	protected abstract handleResetValue(): void;

}
