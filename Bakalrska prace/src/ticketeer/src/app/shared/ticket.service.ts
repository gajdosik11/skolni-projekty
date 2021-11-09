/* xgajdo24
* služba obsahující komunikaci s databází spravující pouze vstupenky
*/
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Wave } from '../../../dm/wave';
import { Ticket } from '../../../dm/ticket';
import { ObjectUtils } from './utils';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    constructor(private afs: AngularFirestore) {}
    /*ziska jednu vstupenku z databaze podle vlny*/
    getTicket(wave: Observable<Wave>): Observable<Ticket> {
        return wave.pipe(
            switchMap((currentWave: Wave) => {
                if (currentWave) {
                    return this.afs
                        .collection<Ticket>('tickets', ref =>
                            ref
                                .where('waveId', '==', currentWave.id)
                                .where('available', '==', true)
                                .limit(1)
                        )
                        .valueChanges()
                        .pipe(
                            map(snap => {
                                if (snap.length !== 0) {
                                    return snap[0];
                                }
                            })
                        );
                } else {
                    return of(null);
                }
            })
        );
    }
    /*zjisti kolik je volnych vstupenek ve vlně*/
    availableTicketsCount(wave: Observable<Wave>): Observable<number> {
        return wave.pipe(
            switchMap((foundWave: Wave) => {
                if (foundWave) {
                    return this.afs
                        .collection<Ticket>('tickets', ref => ref.where('waveId', '==', foundWave.id).where('available', '==', true))
                        .valueChanges()
                        .pipe(
                            map(snap => {
                                return snap.length;
                            })
                        );
                } else {
                    return of(null);
                }
            })
        );
    }
    /*vytvoří vstupenku*/
    createNewTicket(batch: firebase.firestore.WriteBatch, count: number, waveId: string, price: number, paid: boolean): void {
        for (let i = 0; i < count; i++) {
            const docRef = this.afs.firestore.collection('tickets').doc();
            const ticket = new Ticket(docRef.id, waveId, price, paid);
            batch.set(docRef, ObjectUtils.getData(ticket));
        }
    }
    /*označí vstupenku že je zarezervovaná*/
    markTicketAsUnavailable(ticketId: string, userId: string): Promise<any> {
        return this.afs
            .collection('tickets')
            .doc(ticketId)
            .update({
                available: false,
                uId: userId
            });
    }
    /*odrezeruje vstupenku*/
    unmarkTicket(ticketId: string): Promise<any> {
        return this.afs
            .collection('tickets')
            .doc(ticketId)
            .update({
                available: true,
                uId: ''
            });
    }
    /*získá vstupenky uživatele na základě id*/
    getUsersTicket(userId: string) {
        return this.afs
            .collection<Ticket>('tickets', ref => ref.where('uId', '==', userId))
            .valueChanges();
    }
}
