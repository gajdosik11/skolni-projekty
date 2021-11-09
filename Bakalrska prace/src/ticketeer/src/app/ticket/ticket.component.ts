/* xgajdo24
* V této komponntě probíhá veškerá logika prodeje vstupenek
*/
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Ticket, TicketWithEventInfo } from '../../../dm/ticket';
import { TicketService } from '../shared/ticket.service';
import { TicketEventService } from '../shared/ticket-event.service';
import { take } from 'rxjs/operators';
import { Wave } from '../../../dm/wave';
/*Jedná se o enum stavů kterými uživatel při nákupu prochází*/
export enum TicketState {
    MAINPAGE = 'MAINPAGE',
    AUTHENTICATION = 'AUTHENTICATION',
    PAYING = 'PAYING',
    PAIDSUCESS = 'PAIDSUCESS',
    DISPLAY_MY_TICKETS = 'DISPLAY_MY_TICKETS',
    PAIDERROR = 'PAIDERROR'
}
/*jedná se o dekorátor který zajišťuje aby komponenta věděla o svém stavu*/
export function TicketStateAware(constructor) {
    constructor.prototype.TicketState = TicketState;
}

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.scss']
})
@TicketStateAware
export class TicketComponent implements OnInit, OnDestroy {
    /*získání id eventu na který jsou vstupenky prodávány*/
    @Input()
    eventId: string;
    /*pozorovatelné promněné obsahující vstupenku, jejich počet, vlnu, uživatele a  pak obyčejné promněné pro serializační zpracování*/
    ticket$: Observable<Ticket>;
    ticketCount$: Observable<number>;
    wave$: Observable<Wave>;
    user$: Observable<User>;
    ticket: Ticket;
    user: User;
    /*promněné a příznaky pro určení v jaké fázy se uživatel nachází*/
    public register = false;
    public disableCancelAndTimer = true;

    public ticketState: string;
    /*seznam vstupenek které uživatel vlastní tyto data jsou přeposlány do vue části aplikace*/
    public ticketsUserOwns: TicketWithEventInfo[];
    public ticketsUserJustBought: TicketWithEventInfo[];

    constructor(
        public authService: AuthProcessService,
        private httpClient: HttpClient,
        private ticketService: TicketService,
        private ticketEventService: TicketEventService
    ) {}
    /*načtení dat z databáze*/
    ngOnInit() {
        this.user$ = this.authService.user$;
        this.wave$ = this.ticketEventService.getAvailableWave(this.eventId);
        this.ticket$ = this.ticketService.getTicket(this.wave$);
        this.ticketCount$ = this.ticketService.availableTicketsCount(this.wave$);
        this.ticketState = TicketState.MAINPAGE;
        window.onbeforeunload = () => this.ngOnDestroy();
    }
    /*pokud nastane nečekané ukončeníí komunikace vstupenka je odrezervována*/
    async ngOnDestroy() {
        if (this.ticketState === TicketState.PAYING) {
            await this.ticketService.unmarkTicket(this.ticket.id);
        }
    }
    /*funkce zarezervuje vstupenku a přesune uživatele k platbě*/
    public buyTicket(ticket: Ticket): void {
        this.ticket = ticket;
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.ticketService.markTicketAsUnavailable(ticket.id, user.uid).then(() => {
                this.ticketState = TicketState.PAYING;
            });
        });
    }
    /*funkce pro získání tokenu pro platební bránu za pomoci serverové funkce*/
    public getClientToken(): Observable<string> {
        return new Observable<string>(observer => {
            this.httpClient
                .get<any>('getClientToken', {})
                .toPromise()
                .then(token => {
                    if (token) {
                        this.disableCancelAndTimer = false;
                        observer.next(token.token);
                        observer.complete();
                    } else {
                        observer.error();
                    }
                });
        });
    }
    /*za pomoci serverové funkce je provedek pokus o platbu*/
    public createPurchase(nonce: string, chargeAmount: number): Observable<any> {
        this.disableCancelAndTimer = true;
        const body = { nonce, chargeAmount, user: this.user, ticketId: this.ticket.id, eventId: this.eventId };
        return this.httpClient.post('createPurchase', body);
    }
    /*podle úzpěšnosti transakce je uživatel dál přesměrován, v případě neúúspěhu je zerervace vztupenky zrušena*/
    public onPaymentStatus($event: any): void {
        if ($event.success) {
            this.ticketState = TicketState.PAIDSUCESS;
            this.ticketEventService.getUserTickets(this.user.uid, this.ticket.id).subscribe((ticketsUserJustBought: TicketWithEventInfo[]) => {
                this.ticketsUserJustBought = ticketsUserJustBought;
            });
        } else {
            this.ticketState = TicketState.PAIDERROR;
            this.ticketService.unmarkTicket(this.ticket.id).then(() => {
                this.goToMainPage();
            });
        }
    }
    /*kontrola zda je uživatel přihlášen a přesměrování uživatele na registraci nebo platbu*/
    public requestTicket(ticket: Ticket): void {
        this.user$.pipe(take(1)).subscribe(user => {
            if (user != null) {
                this.ticketState = TicketState.PAYING;
                this.buyTicket(ticket);
            } else {
                this.ticketState = TicketState.AUTHENTICATION;
            }
        });
    }
    /*pomocná funkce pro přesun uživatele na přihlášení*/
    public goToAuthentication(): void {
        this.ticketState = TicketState.AUTHENTICATION;
    }
    /*funkce pro vrácení uživatele na úvodní část*/
    public goToMainPage(): void {
        if (this.ticketState === TicketState.PAYING) {
            this.ticketService.unmarkTicket(this.ticket.id).then(() => (this.ticketState = TicketState.MAINPAGE));
        }
        this.ticketState = TicketState.MAINPAGE;
    }
    /*funkce pro odhlášení uživatele*/
    public logout(): void {
        this.authService.signOut();
    }
    /*funkce pro získání vstupenek které uživatel vlastní a přesměrování uživatele na přehled vstupenek*/
    public displayMyTickets(): void {
        this.user$.subscribe(user => {
            if (user) {
                this.ticketEventService.getUserTickets(user.uid).subscribe(tickets => {
                    this.ticketsUserOwns = tickets;
                    this.ticketState = TicketState.DISPLAY_MY_TICKETS;
                });
            }
        });
    }
}
