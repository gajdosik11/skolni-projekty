/* xgajdo24
* komponenta pro vracení validačních erorů
*/
import { Component, Input } from '@angular/core';

export const message = (validator: any, key: string): string => {
    switch (key) {
        case 'invalidTime':
            return `Invalid time!`;
        case 'dateValueMissing':
            return `Missing date!`;
        case 'timeValueMissing':
            return `Missing time!`;
        case 'matDatepickerParse':
            return `Neplatný datum`;
        case 'required':
            return 'Toto pole je povinné!';
        case 'selectNomatch':
            return ' Invalid option!';
        case 'notUnique':
            return ' Value is not unique!';
        case 'pattern':
            return validator.pattern && validator.pattern.patternHelp
                ? validator.pattern.patternHelp
                : 'This field contains forbidden characters!';
        case 'notMatchingPassword':
            return 'Those passwords are not same!';
        case 'isNotUnique':
            return 'The value is not unique!';
        case 'minlength':
            return `The value must be longer than ${validator.minlength.requiredLength}!`;
        case 'maxlength':
            return `The value must be shorter than ${validator.maxlength.requiredLength}!`;
        case 'min':
            return `The value must be bigger than ${validator.min.min}!`;
        case 'max':
            return `The value must be smaller than ${validator.max.max}!`;
        case 'expirationAfterEvent':
            return 'Expirace přesahuje datum akce'
    }
    if (typeof validator[key] === 'string') {
        return <string>validator[key];
    } else {
        return `Validation failed: ${key}`;
    }
};

@Component({
    selector: 'app-validation-errors',
    template: '<div *ngFor="let validationError of validationErrors">{{validationError}}</div>'
})
export class ValidationErrorsComponent {
    @Input() validationErrors: Array<string>;
}
