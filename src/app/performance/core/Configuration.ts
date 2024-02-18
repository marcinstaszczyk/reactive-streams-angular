import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Configuration {

    tableHeight = 540;
    tableWidth = 1200;

    rowsCount = 100;
    columnsCount = 40;

	depth = 300;
	depthRepeat = 10;

}
