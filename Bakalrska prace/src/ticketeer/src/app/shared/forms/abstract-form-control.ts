/* xgjado24
* jedná se o abstraktní třídu rozšičující komponenty určené pro formulář o možnost validace a společné proměnné
*/
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';
import { ChangeDetectorRef, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { message } from './validation-errors';
/*zajisteni validatoru*/
export function provideValueAccessorAndValidators(formControl: any) {
    return [provideValueAccessor(formControl), provideValidators(formControl)];
}

export function provideValueAccessor(formControl: any) {
    return [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => formControl),
            multi: true
        }
    ];
}

export function provideValidators(formControl: any) {
    return [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => formControl),
            multi: true
        }
    ];
}

export abstract class FormControlValueAccessor<T> implements ControlValueAccessor, Validator, OnDestroy {
    /*vstupni atrybuty inputu*/
    @Input()
    placeholder: string;

    @Input()
    label: string;

    @Input()
    required: boolean;

    @Input()
    type: string;
    /*vyvolávč události*/
    @Output()
    public valueChange = new EventEmitter<T>();

    public formControl: FormControl = new FormControl();
    public isValid: boolean;
    public validationErrors: Array<string> = [];

    protected onDestroy = new Subject<void>();

    constructor(protected changeDetectorRef: ChangeDetectorRef) {}

    ngOnDestroy(): void {
        this.onDestroy.next();
        this.onDestroy.complete();
    }

    public onTouched = () => {};

    public writeValue(value: T): void {
        if (value != null) {
            this.formControl.setValue(value, { emitEvent: false });
        }
    }
    /*sleodvání změn*/
    public registerOnChange(fn: any): void {
        this.formControl.valueChanges
            .pipe(
                tap((value: T) => {
                    setTimeout(() => this.valueChange.emit(value));
                }),
                takeUntil(this.onDestroy)
            )
            .subscribe(fn);
    }
    /* co se má provest po odkliknuti z inputu*/
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    /*nastaveni pro uzamknuti inputu*/
    public setDisabledState?(isDisabled: boolean): void {
        isDisabled ? this.formControl.disable({ emitEvent: false }) : this.formControl.enable({ emitEvent: false });
        this.changeDetectorRef.markForCheck();
    }
    /*validování*/
    public validate(control: FormControl): ValidationErrors | null {
        this.isValid = this.formControl.valid;
        this.validationErrors = Object.keys(this.formControl.errors || {}).map(k => message(this.formControl.errors, k));

        return this.isValid ? null : this.formControl.errors;
    }
    /*po odkliknu validuj*/
    public touch(): void {
        this.onTouched();
        this.isValid = !(this.required && !this.formControl.value);

        if (!this.isValid && !this.validationErrors.length) {
            this.validationErrors = [message({ required: true }, 'required')];
        }
    }
}
