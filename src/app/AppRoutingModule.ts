import { BoxContentComponent } from '@/box-content/BoxContentComponent';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselOnDecoratorsComponent } from './carousel/on-decorators/CarouselOnDecoratorsComponent';
import { CarouselContainerComponent } from './carousel/on-selectors-service/CarouselContainerComponent';
import { CarouselOnSelectorsComponent } from './carousel/on-selectors/CarouselOnSelectorsComponent';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'carousel-on-decorators', component: CarouselOnDecoratorsComponent },
    { path: 'carousel-on-selectors', component: CarouselOnSelectorsComponent },
    { path: 'carousel-on-selectors-service', component: CarouselContainerComponent },
    { path: 'box/:boxId', component: BoxContentComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
