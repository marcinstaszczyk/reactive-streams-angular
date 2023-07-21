import { BoardContentComponent } from '@/board-content/BoardContentComponent';
import { PerformanceComponent } from '@/performance/PerformanceComponent';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselOnDecoratorsComponent } from './carousel/on-decorators/CarouselOnDecoratorsComponent';
import { CarouselContainerComponent } from './carousel/on-selectors-service/CarouselContainerComponent';
import { CarouselOnSelectorsComponent } from './carousel/on-selectors/CarouselOnSelectorsComponent';
import { CarouselContainerComponent as CarouselOnSignalsContainerComponent } from './carousel/on-signals/CarouselContainerComponent';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'carousel-on-decorators', component: CarouselOnDecoratorsComponent },
    { path: 'carousel-on-selectors', component: CarouselOnSelectorsComponent },
    { path: 'carousel-on-selectors-service', component: CarouselContainerComponent },
    { path: 'carousel-on-signals', component: CarouselOnSignalsContainerComponent },
    { path: 'board/:boardId', component: BoardContentComponent },
    { path: 'performance', component: PerformanceComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
