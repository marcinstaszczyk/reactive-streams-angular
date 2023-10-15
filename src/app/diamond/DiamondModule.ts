import { DiamondComponent } from '@/diamond/DiamondComponent';
import { DiamondSynchronousComponent } from '@/diamond/synchronous/DiamondSynchronousComponent';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: DiamondComponent,
		children: [
			{ path: 'synchronous', component: DiamondSynchronousComponent }
		]
	},
];

@NgModule({
	declarations: [
		DiamondComponent
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
export class DiamondModule {

}
