import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxComponent } from './box/box.component';
import { CarouselComponent } from './carousel/CarouselComponent';
import { Carousel2Component } from './carousel2/Carousel2Component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'carousel', component: CarouselComponent },
    { path: 'carousel2', component: Carousel2Component },
    { path: 'box/:boxId', component: BoxComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
