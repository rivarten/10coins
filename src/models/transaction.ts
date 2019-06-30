export class TransactionOutputElem {
    private value: number = 0;
    private scriptPubKeyBytes: number;
    private scriptPubKey: string;
    constructor(
        value: number = 0,
        scriptPubKeyBytes: number = 0,
        scriptPubKey: string = '',
    ) {
        this.value = value;
        this.scriptPubKeyBytes = scriptPubKeyBytes;
        this.scriptPubKey = scriptPubKey;
    }
    getData(): any {
        return {
            value: this.value,
            scriptPubKeyBytes: this.scriptPubKeyBytes,
            scriptPubKey: this.scriptPubKey,
        };
    }
}
export class UTXO {
    protected hash: string = '';
    protected index: number = 0;
    protected sequence: number = 0;
    constructor(
        hash: string = '',
        index: number = 0,
        sequence: number = 0xffffffff,
    ) {
        this.hash = hash;
        this.index = index;
        this.sequence = sequence;
    }
}

export class TransactionInputElemNonCoinBase extends UTXO {
    private scriptBytes: number = 0;
    private scriptSig: string = '';
    constructor(
        hash: string = '',
        index: number = 0,
        scriptBytes: number = 0,
        scriptSig: string = '',
        sequence: number = 0xffffffff,
    ) {
        super(hash, index, sequence);
        this.scriptBytes = scriptBytes;
        this.scriptSig = scriptSig;
    }
    getData(): any {
        return {
            hash: this.hash,
            index: this.index,
            scriptBytes: this.scriptBytes,
            scriptSig: this.scriptSig,
            sequence: this.sequence,
        };
    }
}
export class TransactionInputElemCoinBase extends UTXO {
    private coinbaseDataBytes: number = 0;
    private coinbaseData: string = '';
    constructor(
        index: number = 0,
        coinbaseDataBytes: number = 0,
        coinbaseData: string = '',
        sequence: number = 0xffffffff,
    ) {
        super('', index, sequence);
        this.coinbaseDataBytes = coinbaseDataBytes;
        this.coinbaseData = coinbaseData;
    }
    getData(): any {
        return {
            hash: this.hash,
            index: this.index,
            coinbaseDataBytes: this.coinbaseDataBytes,
            coinbaseData: this.coinbaseData,
            sequence: this.sequence,
        };
    }
}

export class Transaction {
    private version: number;
    private txIn: Array<UTXO> = [];
    private txOut: Array<TransactionOutputElem> = [];
    private locktime: number;
    constructor(
        version: number = 1,
        locktime: number = 0,
    ) {
        this.version = version;
        this.locktime = locktime;
    }
    get(): any {
        return {
            version: this.version,
            locktime: this.locktime,
            txIn: this.txIn,
            txOut: this.txOut,
        };
    }
    addTransactionIn(input: UTXO): void {
        this.txIn.push(input);
    }
    addTransactionOut(output: TransactionOutputElem): void {
        this.txOut.push(output);
    }
}
