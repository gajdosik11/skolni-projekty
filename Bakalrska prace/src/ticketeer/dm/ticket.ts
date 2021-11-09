export class Ticket {
    public id: string;
    public waveId: string;
    public uId: string;
    public available: boolean;
    public paid: boolean;
    public price: number;
    public used: boolean;
    public eventId?: string;
    public availableSiblingsCount?: number;

    constructor(id: string, waveId: string, price: number, paid: boolean) {
        this.id = id;
        this.waveId = waveId;
        this.price = price;
        this.available = true;
        this.paid = paid;
        this.uId = '';
        this.used = false;
    }
}

export class TicketWithEventInfo extends Ticket {
    date: string;
    name: string;
    place: string;

    constructor(ticket: Ticket, date: string, name: string, place: string) {
        super(ticket.id, ticket.waveId, ticket.price, ticket.paid);
        this.date = date;
        this.name = name;
        this.place = place;
    }
}
