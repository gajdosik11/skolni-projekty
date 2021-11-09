/* xgajdo24
* komponeneta pro jednoduchá imput pro formulář
*/
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControlValueAccessor, provideValueAccessorAndValidators } from './abstract-form-control';

@Component({
    selector: 'app-input',
    template: `
        <mat-form-field (click)="touch()">
            <mat-label *ngIf="label">{{label}}</mat-label>
            <input [type]="type" [required]="required" [formControl]="formControl" matInput [placeholder]="placeholder" />
            <mat-error>
                <app-validation-errors *ngIf="!formControl.disabled && !isValid" [validationErrors]="validationErrors"></app-validation-errors>
            </mat-error>
        </mat-form-field>
    `,
    providers: provideValueAccessorAndValidators(InputComponent)
})
export class InputComponent extends FormControlValueAccessor<string | number> {
    constructor(protected changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
    }
}
