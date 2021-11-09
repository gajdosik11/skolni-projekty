/* xgajdo24
* komponenta obsahujici výběr datumu pomocí kalendáře, datum se generuje pomoci knihovny moment
*/
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from 'moment';

import { FormControlValueAccessor, provideValueAccessorAndValidators } from './abstract-form-control';
import { DATE_FORMAT } from '../date-adapter';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-datepicker',
    template: `
        <mat-form-field (click)="touch()">
            <mat-label *ngIf="label">{{ label }}</mat-label>
            <input
                (dateChange)="setDate($event.target.value)"
                [dateToCompare]="dateToCompare"
                appDatePeriodValidator
                matInput
                autocomplete="off"
                maxlength="12"
                (blur)="blur()"
                [formControl]="formControl"
                [matDatepicker]="picker"
                [required]="required"
                [placeholder]="placeholder"
            />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error>
                <app-validation-errors *ngIf="!formControl.disabled && !isValid" [validationErrors]="validationErrors"></app-validation-errors>
            </mat-error>
        </mat-form-field>
    `,
    providers: provideValueAccessorAndValidators(DatepickerComponent)
})
export class DatepickerComponent extends FormControlValueAccessor<string | number> {
    @Input()
    dateToCompare: AbstractControl;
    constructor(protected changeDetectorRef: ChangeDetectorRef) {
        super(changeDetectorRef);
    }
    /*při odkliknutí zpracuj datum*/
    blur(): void {
        this.setDate(this.formControl.value);
    }
    /*zpracovani datumu*/
    public setDate(value: string): void {
        const date = moment(value);
        this.formControl.setValue(
            date.isValid() && date.isBetween(moment(), moment().add(10, 'years'), 'days', '[]') ? date.format(DATE_FORMAT) : null
        );
    }
}
