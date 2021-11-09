"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ticket {
    constructor(id, waveId, price, /* level: number, code: string, */ paid) {
        this.id = id;
        this.waveId = waveId;
        this.price = price;
        // this.level = level;
        this.available = true;
        this.paid = paid;
        this.uId = '';
        this.used = false;
    }
}
exports.Ticket = Ticket;
//# sourceMappingURL=ticket.js.map