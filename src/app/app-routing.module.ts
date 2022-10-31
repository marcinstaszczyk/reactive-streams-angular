import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxComponent } from './box/box.component';
import { CarouselOnDecoratorsComponent } from './carousel/on-decorators/CarouselOnDecoratorsComponent';
import { CarouselOnSelectorsComponent } from './carousel/on-selectors/CarouselOnSelectorsComponent';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'carousel-on-decorators', component: CarouselOnDecoratorsComponent },
    { path: 'carousel-on-selectors', component: CarouselOnSelectorsComponent },
    { path: 'box/:boxId', component: BoxComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
