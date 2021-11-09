import { Wave } from './wave';

export class TicketEvent {
    public id: string;
    public uId: string;
    public name: string;
    public date: string;
    public waves?: Wave[];
    public imgUrl: string;
    public place: string;

    constructor(id: string, uId: string, name: string, date: string, imgUrl: string, place: string) {
        this.id = id;
        this.uId = uId;
        this.name = name;
        this.date = date;
        this.imgUrl = imgUrl;
        this.place = place;
    }
}
