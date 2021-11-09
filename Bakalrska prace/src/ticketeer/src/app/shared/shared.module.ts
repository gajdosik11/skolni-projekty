/* xgajdo24
* správa sdílených modulů
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerComponent } from './forms/datepicker.component';
import { ValidationErrorsComponent } from './forms/validation-errors';
import { InputComponent } from './forms/input.component';
import { SweetAlertErrorComponent, SweetAlertSuccessComponent, SweetAlertWarningComponent } from './sweet-alert/sweet-alert.component';
import { DatePeriodValidator } from './forms/date-period-validator';
import { TimeoutComponent } from './timeout/timeout.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        MatInputModule,
        FlexLayoutModule,
        MatSelectModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule,
        MatToolbarModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        NgxMatFileInputModule
    ],
    declarations: [
        LoaderComponent,
        DatepickerComponent,
        ValidationErrorsComponent,
        InputComponent,
        SweetAlertErrorComponent,
        SweetAlertSuccessComponent,
        SweetAlertWarningComponent,
        DatePeriodValidator,
        TimeoutComponent
    ],
    exports: [
        CommonModule,
        MatInputModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatStepperModule,
        LoaderComponent,
        DatepickerComponent,
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorsComponent,
        InputComponent,
        SweetAlertErrorComponent,
        SweetAlertSuccessComponent,
        SweetAlertWarningComponent,
        DatePeriodValidator,
        TimeoutComponent,
        NgxMatFileInputModule
    ]
})
export class SharedModule {}
