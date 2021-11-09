import { Ticket } from './ticket';

export class Wave {
    public id: string;
    public eventId: string;
    public price: number;
    public count: number;
    public expiration: string;
    public soldOut: boolean;
    public tickets?: Ticket[];

    constructor(id: string, eventId: string, price: number, count: number, expiration: string) {
        this.id = id;
        this.eventId = eventId;
        this.price = price;
        this.count = count;
        this.expiration = expiration;
        this.soldOut = count <= 0;
    }
}
