import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
	{ path: 'carousel', loadChildren: () => import('@/carousel/CarouselModule').then(m => m.CarouselModule) },
	{ path: 'diamond', loadChildren: () => import('@/diamond/DiamondModule').then(m => m.DiamondModule) },
    { path: 'board/:boardId', loadComponent: () => import('@/board-content/BoardContentComponent').then(m => m.BoardContentComponent) },
    { path: 'performance', loadComponent: () => import('@/performance/PerformanceComponent').then(m => m.PerformanceComponent) },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
