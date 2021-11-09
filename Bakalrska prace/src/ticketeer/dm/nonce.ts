export class Nonce {
    public nonce: string;
    public chargeAmount: number;

    constructor(nonce: string, chargeAmount: number) {
        this.nonce = nonce;
        this.chargeAmount = chargeAmount;
    }
}
