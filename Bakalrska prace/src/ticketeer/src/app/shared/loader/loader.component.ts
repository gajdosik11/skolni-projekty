/* xgajdo24
* komponenta obsahující animaci pro načítání
*/
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    host: { id: 'app-loader' },
    encapsulation: ViewEncapsulation.None
})
export class LoaderComponent {}
