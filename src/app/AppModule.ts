import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './AppRoutingModule';
import { AppComponent } from './AppComponent';

import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { RxRenderStrategiesConfig } from '@rx-angular/cdk/render-strategies/lib/config';

const rxRenderStrategiesConfig: RxRenderStrategiesConfig<never> = { primaryStrategy: 'local' };

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: RX_RENDER_STRATEGIES_CONFIG, useValue: rxRenderStrategiesConfig }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
