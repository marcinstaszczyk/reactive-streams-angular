import { BoardContentComponent } from '@/board-content/BoardContentComponent';
import { CarouselModule } from '@/carousel/CarouselModule';
import { DiamondModule } from '@/diamond/DiamondModule';
import { PerformanceComponent } from '@/performance/PerformanceComponent';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
	{ path: 'carousel', loadChildren: () => CarouselModule },
	{ path: 'diamond', loadChildren: () => DiamondModule },
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
