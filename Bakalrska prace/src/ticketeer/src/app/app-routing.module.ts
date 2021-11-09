
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import {TicketComponent} from './ticket/ticket.component';
import {AppComponent} from './app.component';

const routes: Routes = [
    /* {
        path: '',
        component: TicketComponent,
        pathMatch: 'full'
    },*/
    {
        path: '',
        component: TicketComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
