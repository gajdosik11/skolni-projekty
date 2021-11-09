/* xgajdo24
* validator zda datumi jsou logicky po sobe
*/
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import * as moment from 'moment';
import { Directive, Input } from '@angular/core';

export function dateValidator(abstractControl: AbstractControl, dateToCompare): { [s: string]: boolean } {
    if (dateToCompare) {
        if (moment(abstractControl.value).isAfter(dateToCompare.value)) {
            return { expirationAfterEvent: true };
        }
    }
    return null;
}

@Directive({
    selector: '[appDatePeriodValidator][formControlName], [appDatePeriodValidator][ngModel], [appDatePeriodValidator][formControl]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: DatePeriodValidator,
            multi: true
        }
    ]
})
export class DatePeriodValidator implements Validator {
    @Input()
    dateToCompare: string;

    validate(control: AbstractControl) {
        return dateValidator(control, this.dateToCompare);
    }
}
