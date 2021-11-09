/* xgajdo24
* kontrola vstupenek zda jsou platné
*/
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { TicketEventService } from '../../shared/ticket-event.service';
import { Observable } from 'rxjs';
import { Ticket } from '../../../../dm/ticket';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
/*stavy do kterých může vstupenka vstoupit*/
export enum Access {
    PERMITTED,
    DENIED,
    USED,
    NOTPAID,
    UNKNOWN
}

@Component({
    selector: 'app-ticket-validator',
    templateUrl: './ticket-validator.component.html',
    styleUrls: ['./ticket-validator.component.scss']
})
export class TicketValidatorComponent implements OnInit {
    /*komponenta získá id události pro získání seznamu vstupenek*/
    @Input()
    private eventId: string;
    private tickets$: Observable<Ticket[]>;
    public access;
    public code;

    constructor(
        private route: ActivatedRoute,
        private authProcessService: AuthProcessService,
        private ticketEventService: TicketEventService,
        private afs: AngularFirestore
    ) {}
    /*při inicializaci zažádá o vstupenky které patří ke kontrolované události*/
    ngOnInit() {
        this.authProcessService.user$.subscribe(user => {
            this.tickets$ = this.ticketEventService.getEventTickets(user.uid, this.eventId);
        });
        this.access = Access.UNKNOWN;
    }
    /*po získání kódu pomocí čtečky nebo manuálním zadáním je kód porovnán s databází vstupenek*/
    onCodeScan(code: string): void {
        this.tickets$
            .pipe(
                take(1),
                map(tickets => {
                    const ticket = tickets.find(t => t.id === code);
                    if (ticket) {
                        if (!ticket.used && ticket.paid) {
                            this.access = Access.PERMITTED;
                            this.afs
                                .collection('tickets')
                                .doc(ticket.id)
                                .update({ used: true });
                            return;
                        } else if (ticket.paid) {
                            this.access = Access.USED;
                            return;
                        } else if (!ticket.used) {
                            this.access = Access.NOTPAID;
                            return;
                        }
                    } else {
                        this.access = Access.DENIED;
                    }
                })
            )
            .subscribe();
    }
}
