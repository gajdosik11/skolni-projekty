/* xgajdo24
* nastaveni formatu datumů
*/
import {MatDateFormats} from '@angular/material/core';
import 'moment-duration-format';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = DATE_FORMAT + ' ' + TIME_FORMAT;
export const DATE_DISPLAY_FORMAT = 'DD.MM.YYYY';
export const DATE_TIME_DISPLAY_FORMAT = 'DD.MM.YYYY HH:mm';

export const MOMENT_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'DD.MM.YYYY'
    },
    display: {
        dateInput: DATE_DISPLAY_FORMAT,
        monthYearLabel: 'MMMM Y',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM Y'
    }
};
