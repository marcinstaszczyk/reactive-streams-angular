import { ApplicationRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivationEnd, Event, NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

    constructor(
        router: Router,
        a: ApplicationRef,
    ) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd || event instanceof ActivationEnd) {
                a.tick();
            }
        });
    }

}
