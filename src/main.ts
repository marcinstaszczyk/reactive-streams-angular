import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/AppModule';

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'zone.js' })
    .catch(err => console.error(err));
