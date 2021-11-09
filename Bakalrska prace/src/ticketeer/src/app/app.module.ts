/* xgajdo24
Zde jsou uloženy veškeré služby které aplikace využívá a jsou jip předány parametry */
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import { TicketComponent } from './ticket/ticket.component';

import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { registerLocaleData } from '@angular/common';
import cs from '@angular/common/locales/cs';
import * as moment from 'moment';
import 'moment/min/locales';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxBraintreeModule } from 'ngx-braintree';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePeriodValidator } from './shared/forms/date-period-validator';
import { createCustomElement } from '@angular/elements';
import { AdminComponent } from './admin/admin.component';

moment.locale('cs');
registerLocaleData(cs);

@NgModule({
    declarations: [AppComponent, TicketComponent],
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule,
        AdminModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        NgxAuthFirebaseUIModule.forRoot(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        NgxBraintreeModule,
        HttpClientModule,
        FontAwesomeModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'cs' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        {
            provide: LOCALE_ID,
            useValue: 'cs'
        },
        DatePeriodValidator
    ],
    entryComponents: [TicketComponent, AppComponent],
    /*bootstrap: [AppComponent],*/
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/*Tato třída zpracocácá aplikaci do dvou webových komponent admin a ticket*/
export class AppModule {
    constructor(private injector: Injector) {
        const ticketElement = createCustomElement(TicketComponent, { injector: this.injector });
        customElements.define('app-ticket', ticketElement);

        const appElement = createCustomElement(AdminComponent, { injector: this.injector });
        customElements.define('app-admin', appElement);
    }

    ngDoBootstrap() {}
}
