import * as crypto from 'crypto';

import { Transaction } from './transaction';

export class BlockHeader {
    private version: number;
    private prevBlockHash: string;
    private merkleRootHash: string;
    private time: number;
    private difficultyTarget: number;
    private nonce: number;
    constructor(
        version: number = 0,
        prevBlockHash: string = '',
        merkleRootHash: string = '',
        time: number = 0,
        difficultyTarget: number = 0,
        nonce: number = 0,
    ) {
        this.version = version;
        this.prevBlockHash = prevBlockHash;
        this.merkleRootHash = merkleRootHash;
        this.time = time;
        this.difficultyTarget = difficultyTarget;
        this.nonce = nonce;
    }
    getData(): any {
        return {
            version: this.version,
            prevBlockHash: this.prevBlockHash,
            merkleRootHash: this.merkleRootHash,
            time: this.time,
            difficultyTarget: this.difficultyTarget,
            nonce: this.nonce,
        };
    }
};

export class Block {
    private transactions: Array<Transaction> = [];
    //private header: BlockHeader = new BlockHeader();
    private hash: string = ''; 
    constructor() {
    }
    getMerkleRoot(): string {
        return 'block merkle root';
    }
    getSerializedData(): string {
        return 'serialized block data';
    }
    addTransaction(transaction: Transaction): Boolean {
        this.transactions.push(transaction);
        return true;
    }
    getTransactions(): any {
        return this.transactions;
    }
    getHash(): string {
        //本来は、SHA256ダブルハッシュをInternalByteOrderで順序を反転したものをさらに逆順にする

        let sha256;
        sha256 = crypto.createHash('sha256');
        sha256.setEncoding('hex');
        sha256.write(this.getSerializedData());
        sha256.end();
        const firstHashedData = sha256.read().toString();
        sha256 = crypto.createHash('sha256');
        sha256.setEncoding('hex');
        sha256.write(firstHashedData);
        sha256.end();
        const secondHashedData = sha256.read().toString();
        this.hash = secondHashedData;
        return this.hash;
    }
}
