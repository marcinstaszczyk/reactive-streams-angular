import { CarouselComponent } from '@/carousel/CarouselComponent';
import { CarouselOnDecoratorsComponent } from '@/carousel/on-decorators/CarouselOnDecoratorsComponent';
import { CarouselContainerComponent } from '@/carousel/on-selectors-service/CarouselContainerComponent';
import { CarouselOnSelectorsComponent } from '@/carousel/on-selectors/CarouselOnSelectorsComponent';
import { CarouselContainerComponent as CarouselOnSignalsContainerComponent } from '@/carousel/on-signals/CarouselContainerComponent';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: CarouselComponent,
		children: [
			{ path: 'carousel-on-decorators', component: CarouselOnDecoratorsComponent },
			{ path: 'carousel-on-selectors', component: CarouselOnSelectorsComponent },
			{ path: 'carousel-on-selectors-service', component: CarouselContainerComponent },
			{ path: 'carousel-on-signals', component: CarouselOnSignalsContainerComponent },
		]
	},
];

@NgModule({
	declarations: [
		CarouselComponent
	],
	imports: [
		RouterModule.forChild(routes),
		RouterLink,
		RouterLinkActive,
		RouterOutlet,
	],
	exports: [
		RouterModule
	]
})
export class CarouselModule {

}
