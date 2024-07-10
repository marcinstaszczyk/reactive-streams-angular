import { NgModule, provideExperimentalZonelessChangeDetection as provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { RxRenderStrategiesConfig } from '@rx-angular/cdk/render-strategies/lib/config';
import { AppComponent } from './AppComponent';

import { AppRoutingModule } from './AppRoutingModule';

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
		provideZonelessChangeDetection(),
        { provide: RX_RENDER_STRATEGIES_CONFIG, useValue: rxRenderStrategiesConfig }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
