/* xgajdo24
* zde se řeší logika spávy vstupenek, tato část je rozdělenea do více podkomponent
*/
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';
import { TicketEvent } from '../../../dm/ticket-event';
import { TicketEventService } from '../shared/ticket-event.service';
import { CreateOrEditTicketEventDialogComponent } from './ticket-event-table/create-or-edit-ticket-event-dialog/create-or-edit-ticket-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, mergeMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

export interface DbUser extends User {
    isAdmin: boolean;
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
    /*pozorovatelné promněné uživatele a událostí které obsahují i datat o vlnách a vstupenkách*/
    public user$: Observable<User>;
    public events$: Observable<TicketEvent[]>;

    public selectedEventId: string;

    constructor(
        private authService: AuthProcessService,
        private ticketEventService: TicketEventService,
        private dialog: MatDialog,
        public afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.setEvents();
    }
    /*funkce pro získání dat o uživateli s dodatečným odposloucháváním paramteru zda je uživatel admin isAdmin*/
    private getDbUser(): Observable<DbUser> {
        return this.afAuth.authState.pipe(
            mergeMap(data => {
                if (data) {
                    return this.afs
                        .collection('users')
                        .doc(`${data.uid}`)
                        .get()
                        .pipe(map(user => user.data())) as Observable<DbUser>;
                } else {
                    return of(null);
                }
            })
        );
    }
    /*sekece pro buďto zamítnutí přístupu pokud uživatel nemá príva, nebo načtení dat o událostech uživatele*/
    public setEvents(): void {
        this.getDbUser().subscribe((user: DbUser) => {
            if (!user || !user.isAdmin) {
                this.snackBar.open('Tato sekce je pouze pro administrátory! Budete přesměrování na hlavní stranu.', 'Rozumím');
            } else {
                this.user$ = this.authService.user$;
                this.events$ = this.ticketEventService.getEvents(user.uid);
            }
        });
    }

    onSuccess() {
        this.setEvents();
    }

    setSelectedEvent(selectedEventId: string): void {
        this.selectedEventId = selectedEventId;
    }
    /* spuštění komponenty obsahující modal okno a formulář pro vytvoření události, po zavření kompoennty jsou data zaslána ndo databáze*/
    createNewEvent(user: User): void {
        this.dialog
            .open(CreateOrEditTicketEventDialogComponent, { disableClose: true })
            .afterClosed()
            .subscribe(data => {
                if (data) {
                    this.ticketEventService.createNewEvent(user.uid, data.name, data.date, data.imgUrl, data.place, data.waves);
                }
            });
    }
}
