/* xgajdo24
* služba zajišťující komunikaci s dtabází, především událostí a vln
*/
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { TicketEvent } from '../../../dm/ticket-event';
import * as moment from 'moment';
import { Wave } from '../../../dm/wave';
import { Ticket, TicketWithEventInfo } from '../../../dm/ticket';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ObjectUtils } from './utils';
import { TicketService } from './ticket.service';
import * as firebase from 'firebase';
import { QueryFn } from '@angular/fire/firestore/interfaces';

@Injectable({
    providedIn: 'root'
})
export class TicketEventService {
    constructor(private afs: AngularFirestore, private router: Router, private ticketService: TicketService) {}
    /*získá vlnu s nejmenším datumem expirace pro událost*/
    getAvailableWave(eventId: string): Observable<Wave> {
        if (eventId) {
            return this.afs
                .collection<Wave>('waves', ref =>
                    ref
                        .where('eventId', '==', eventId)
                        .where('soldOut', '==', false)
                        .orderBy('expiration', 'asc')
                )
                .valueChanges()
                .pipe(map(snap => snap[0]));
        } else {
            return of();
        }
    }
    /*získá všechny vlny události*/
    getWaves(eventId: string): Observable<Wave[]> {
        return this.afs
            .collection<Wave>('waves', ref => ref.where('eventId', '==', eventId))
            .valueChanges()
            .pipe(
                map(snap => {
                    return snap;
                })
            );
    }
    /*získá seznam všech nduálostí uživatele a nebo jen specifickou událost uživatele s všemi vlnami a vstupenkami v objektové struktuře*/
    getEvents(uId: string, eventId?: string): Observable<TicketEvent[]> {
        return combineLatest([
            this.afs
                .collection<TicketEvent>(
                    'events',
                    eventId == null ? ref => ref.where('uId', '==', uId) : ref => ref.where('uId', '==', uId).where('id', '==', eventId)
                )
                .valueChanges(),
            this.afs
                .collection<Wave>('waves', ref => ref.orderBy('expiration', 'asc'))
                .valueChanges(),
            this.afs.collection<Ticket>('tickets').valueChanges()
        ]).pipe(
            map(([eventsSnap, wavesSnap, ticketsSnap]) => {
                const events: TicketEvent[] = [];
                eventsSnap.forEach(eventSnap => {
                    const ticketEvent: TicketEvent = eventSnap as TicketEvent;
                    if (!moment().isAfter(moment(ticketEvent.date, 'YYYY-MM-DD'))) {
                        events.push(ticketEvent);
                    }
                });

                const waves: Wave[] = [];
                wavesSnap.forEach(waveSnap => waves.push(waveSnap as Wave));

                const tickets: Ticket[] = [];
                ticketsSnap.forEach(ticketSnap => tickets.push(ticketSnap as Ticket));

                waves.forEach(wave => (wave.tickets = tickets.filter(ticket => ticket.waveId === wave.id)));

                return events.map(event => ({ ...event, waves: waves.filter(wave => wave.eventId === event.id) }));
            }),
            catchError(() => {
                setTimeout(() => this.router.navigate(['/']), 5000);
                return of([]);
            })
        );
    }
    /*získá vstupenky na událost uživatele*/
    getEventTickets(uId: string, eventId): Observable<Ticket[]> {
        return this.getEvents(uId, eventId).pipe(
            map((ticketEvent: TicketEvent[]) => {
                const tickets: Ticket[] = [];
                ticketEvent[0].waves.forEach(wave => {
                    wave.tickets.forEach(ticket => {
                        tickets.push(ticket);
                    });
                });
                return tickets;
            })
        );
    }
    /*vytvoří novou událost, napojuje se na vytvořeí vln*/
    createNewEvent(uId: string, eventName: string, eventDate: string, imgUrl: string, place: string, waves?: Wave[]): void {
        const docRef = this.afs.firestore.collection('events').doc();
        const event = new TicketEvent(docRef.id, uId, eventName, eventDate, imgUrl, place);
        const batch = this.afs.firestore.batch();
        batch.set(docRef, ObjectUtils.getData(event));
        this.createNewWaves(batch, event.id, waves);
        batch.commit().then();
    }
    /*vytvoří vlny, napojuje se na vytvoření vstupenek*/
    createNewWaves(batch: firebase.firestore.WriteBatch, eventId: string, waves?: Wave[]): void {
        waves.forEach(data => {
            const docRef = this.afs.firestore.collection('waves').doc();
            const wave = new Wave(docRef.id, eventId, data.price, data.count, data.expiration);
            batch.set(docRef, ObjectUtils.getData(wave));
            this.ticketService.createNewTicket(batch, wave.count, wave.id, wave.price, false);
        });
    }
    /*upraví událost*/
    editEvent(uId: string, ticketEvent: TicketEvent): void {
        const docRef = this.afs.firestore.collection('events').doc(ticketEvent.id);
        const batch = this.afs.firestore.batch();
        batch.update(docRef, { name: ticketEvent.name, date: ticketEvent.date });
        this.editWaves(batch, ticketEvent.id, ticketEvent.waves).subscribe(() => batch.commit());
    }
    /*upravý vlny*/
    editWaves(batch: firebase.firestore.WriteBatch, eventId: string, waves?: Wave[]): Observable<any> {
        return this.getWaves(eventId).pipe(
            take(1),
            map(oldWaves => {
                oldWaves.forEach(oldWave => {
                    const found = waves.find(i => i.id === oldWave.id);
                    const docRef = this.afs.firestore.collection('waves').doc(oldWave.id);
                    if (!found) {
                        batch.delete(docRef);
                    } else {
                        for (const key in found) {
                            if (found[key] !== oldWave[key]) {
                                batch.update(docRef, { [key]: found[key] });
                            }
                        }
                    }
                });
                const newWaves: Wave[] = [];
                waves.forEach(wave => {
                    if (wave.id == null) {
                        newWaves.push(wave);
                    }
                });
                if (newWaves.length > 0) {
                    this.createNewWaves(batch, eventId, newWaves);
                }
                return of(null);
            })
        );
    }
    /*získá vstupenky které uživatel vlastní*/
    getUserTickets(uId: string, ticketId?: string): Observable<TicketWithEventInfo[]> {
        const queryFn: QueryFn = ref =>
            ticketId == null ? ref.where('uId', '==', uId) && ref.where('paid', '==', true) : ref.where('id', '==', ticketId);
        return combineLatest([
            this.afs.collection<Ticket>('tickets', queryFn).valueChanges(),
            this.afs.collection<TicketEvent>('events').valueChanges()
        ]).pipe(
            switchMap(([tickets, events]: [Ticket[], TicketEvent[]]) => {
                if (tickets.length) {
                    const waveIds = tickets.map(t => t.waveId);
                    return this.afs
                        .collection<Wave>('waves', ref => ref.where('id', 'in', waveIds))
                        .valueChanges()
                        .pipe(
                            map((waves: Wave[]) => {
                                const eventsById: Map<string, TicketEvent> = ObjectUtils.createMap(events, 'id');
                                const waveIdToEventId: Map<string, string> = ObjectUtils.createMap(waves, 'id', 'eventId');

                                return tickets.map(ticket => {
                                    ticket.eventId = waveIdToEventId.get(ticket.waveId);
                                    const ticketEvent: TicketEvent = eventsById.get(ticket.eventId);
                                    if (ticketEvent) {
                                        return new TicketWithEventInfo(ticket, ticketEvent.date, ticketEvent.name, ticketEvent.place);
                                    } else {
                                        return null;
                                    }
                                });
                            })
                        );
                } else {
                    of([]);
                }
            })
        );
    }
}
