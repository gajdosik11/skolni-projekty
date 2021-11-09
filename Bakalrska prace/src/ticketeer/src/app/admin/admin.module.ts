/* xgajdo24
* deklarace a import/export modulů potřebných pro komponenty spávy vstupenek AdminComponent
*/
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { CreateOrEditTicketEventDialogComponent } from './ticket-event-table/create-or-edit-ticket-event-dialog/create-or-edit-ticket-event-dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketEventTableComponent } from './ticket-event-table/ticket-event-table.component';
import { CodeReaderComponent } from '../shared/code-reader/code-reader.component';
import { TicketValidatorComponent } from './ticket-validator/ticket-validator.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [AdminComponent, CreateOrEditTicketEventDialogComponent, TicketEventTableComponent, CodeReaderComponent, TicketValidatorComponent],
    imports: [SharedModule, NgxAuthFirebaseUIModule, CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
    exports: [AdminComponent],
    entryComponents: [CreateOrEditTicketEventDialogComponent]
})
export class AdminModule {}
