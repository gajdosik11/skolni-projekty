/* xgajdo24
* tato komponenta zajišťuje zobrazení tabulky s informacemi o událostech
*/
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TicketEvent } from '../../../../dm/ticket-event';
import { TicketEventService } from '../../shared/ticket-event.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from '../../shared/ticket.service';
import { faCheck, faInfo, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CreateOrEditTicketEventDialogComponent } from './create-or-edit-ticket-event-dialog/create-or-edit-ticket-event-dialog.component';

@Component({
    selector: 'app-ticket-event-table',
    templateUrl: './ticket-event-table.component.html',
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
        ])
    ]
})
export class TicketEventTableComponent implements AfterViewInit {
    /*získání id uživatele pro získání dat o události*/
    @Input() uId: string;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;
    /*vyšel upozornění pro spuštění validátoru*/
    @Output()
    public selectedEventId = new EventEmitter<string>();
    /*definice struktury tabulky mat table, jedná se o dvě vnořené tabulky*/
    public columns: string[] = ['id', 'name', 'date', 'actions'];
    public innerColumns: string[] = ['price', 'count'];
    public innerColumnsToDisplay: string[] = ['Vyprodáno', 'Expirace', 'Cena', 'Počet', 'Zbývá'];
    public dataSource: MatTableDataSource<TicketEvent>;
    public expandedElement: TicketEvent | null;
    public ticketsAvailableCount = new Map<string, number>();
    public events: TicketEvent[];
    /*ikony*/
    public faTimes = faTimes;
    public faCheck = faCheck;
    public faInfo = faInfo;

    constructor(private ticketEventService: TicketEventService, private ticketService: TicketService, private dialog: MatDialog) {}
    /*zajištuje aktualizaci dat při změně v databázi a načítá je do tabulky*/
    ngAfterViewInit() {
        this.ticketEventService.getEvents(this.uId).subscribe(events => {
            this.events = events;
            events.map(event => {
                event.waves.map(wave => {
                    const count = wave.tickets.filter(ticket => ticket.available === true).length;
                    this.ticketsAvailableCount.set(wave.id, count);
                });
            });
            this.dataSource = new MatTableDataSource(events);
            this.dataSource.sort = this.sort;
        });
    }
    /* funkce pro spuštění modálního okna pro editaci události, po zavření jsou datta odeslána do databáze*/
    editEvent(eventId): void {
        this.dialog
            .open(CreateOrEditTicketEventDialogComponent, { data: { eventId, uId: this.uId } })
            .afterClosed()
            .subscribe(data => {
                if (data) {
                    this.ticketEventService.editEvent(this.uId, { ...data, id: eventId });
                }
            });
    }
    /*spouští validaci vstupeenk*/
    // tslint:disable-next-line:no-shadowed-variable
    validateTickets(eventId: string): void {
        this.selectedEventId.next(eventId);
    }
}
