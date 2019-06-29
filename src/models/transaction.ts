export class Transaction {
    private amount: number;
    private fee: number;
    private from: string;
    private to: string;
    constructor(amount: number, fee: number, from: string, to: string) {
        this.amount = amount;
        this.fee = fee;
        this.from = from;
        this.to = to;
    }
    get(): any {
        return {
            amount: this.amount,
            fee: this.fee,
            from: this.from,
            to: this.to,
        };
    }
}
