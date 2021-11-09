/* xgajdo24
* komponenty pro animace upozornění
*/
import { Component } from '@angular/core';

@Component({
    selector: 'app-sweet-alert-success',
    styleUrls: ['./sweet-alert.component.scss'],
    template: `
        <div class="f-modal-alert">
            <div class="f-modal-icon f-modal-success animate">
                <span class="f-modal-line f-modal-tip animateSuccessTip"></span>
                <span class="f-modal-line f-modal-long animateSuccessLong"></span>
                <div class="f-modal-placeholder"></div>
                <div class="f-modal-fix"></div>
            </div>
        </div>
    `
})
export class SweetAlertSuccessComponent {}

@Component({
    selector: 'app-sweet-alert-warning',
    styleUrls: ['./sweet-alert.component.scss'],
    template: `
        <div class="f-modal-alert">
            <div class="f-modal-icon f-modal-warning scaleWarning">
                <span class="f-modal-body pulseWarningIns"></span>
                <span class="f-modal-dot pulseWarningIns"></span>
            </div>
        </div>
    `
})
export class SweetAlertWarningComponent {}

@Component({
    selector: 'app-sweet-alert-error',
    styleUrls: ['./sweet-alert.component.scss'],
    template: `
        <div class="f-modal-icon f-modal-error animate">
            <span class="f-modal-x-mark">
                <span class="f-modal-line f-modal-left animateXLeft"></span>
                <span class="f-modal-line f-modal-right animateXRight"></span>
            </span>
            <div class="f-modal-placeholder"></div>
            <div class="f-modal-fix"></div>
        </div>
    `
})
export class SweetAlertErrorComponent {}
