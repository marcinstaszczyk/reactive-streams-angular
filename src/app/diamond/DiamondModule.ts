import { DiamondAsynchronousOnSignalsComponent } from '@/diamond/asynchronous-on-signals/DiamondAsynchronousOnSignalsComponent';
import { DiamondAsynchronousWithSourceComponent } from '@/diamond/asynchronous-with-source/DiamondAsynchronousWithSourceComponent';
import { DiamondAsynchronousComponent } from '@/diamond/asynchronous/DiamondAsynchronousComponent';
import { DiamondComponent } from '@/diamond/DiamondComponent';
import { DiamondSynchronousDoubleOnSignalsComponent } from '@/diamond/synchronous-double-on-signals/DiamondSynchronousDoubleOnSignalsComponent';
import { DiamondSynchronousDoubleComponent } from '@/diamond/synchronous-double/DiamondSynchronousDoubleComponent';
import { DiamondSynchronousComponent } from '@/diamond/synchronous/DiamondSynchronousComponent';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: DiamondComponent,
		children: [
			{ path: 'synchronous', component: DiamondSynchronousComponent },
			{ path: 'synchronous-double', component: DiamondSynchronousDoubleComponent },
			{ path: 'synchronous-double-on-signals', component: DiamondSynchronousDoubleOnSignalsComponent },
			{ path: 'asynchronous', component: DiamondAsynchronousComponent },
			{ path: 'asynchronous-with-source', component: DiamondAsynchronousWithSourceComponent },
			{ path: 'asynchronous-on-signals', component: DiamondAsynchronousOnSignalsComponent },
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
