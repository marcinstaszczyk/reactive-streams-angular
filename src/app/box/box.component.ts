import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BoxService } from './services/box.service';
import { Observable } from 'rxjs';
import { BoxId } from './domain/BoxId';

@Component({
    selector: 'app-box',
    standalone: true,
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss'],
    providers: [
        BoxService // provided in root is not getting boxId route param right
    ]
})
export class BoxComponent implements OnInit {

    readonly boxId$: Observable<BoxId> = this.boxService.selectBox$();
    boxId!: BoxId;

    constructor(
        private boxService: BoxService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this.boxId$.subscribe((boxId) => {
            this.boxId = boxId;
            this.changeDetectorRef.detectChanges();
        })
        this.boxService.selectBox$().subscribe((boxId) => {
            this.boxId = boxId;
            this.changeDetectorRef.detectChanges();
        })
        this.boxService.selectBox$().subscribe((boxId) => {
            this.boxId = boxId;
            this.changeDetectorRef.detectChanges();
        })
    }

}
