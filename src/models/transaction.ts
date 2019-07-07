import * as crypto from 'crypto';
import * as secp256k1 from 'secp256k1';

import { Account } from './account';

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
export class Script {
    protected scriptPubKey: string = '';
    protected scriptSig: string = '';
    protected account: Account;
    protected hashType: string = 'SIGHASH_ALL';
    constructor(account: Account) {
        this.account = account;
    }
    getScriptPubKey(): Buffer {
        //ScriptPubKey: 本当は, OP_DUP OP_HASH160 <PublicKey Hash A>  OP_EQUALVERIFY OP_CHECKSIG
        const sha256 = crypto.createHash('sha256');
        sha256.setEncoding('hex');
        sha256.write(this.account.getKeyPair.getKeys().publicKey.toString('hex'));
        sha256.end();
        const pubKeyHashA = sha256.read().toString('hex');
        return Buffer.from(`OP_DUP OP_HASH256 ${pubKeyHashA} OP_EQUALVERIFY OP_CHECKSIG`, 'binary');
    }
    protected getSignatureHash(transaction: Transaction): Buffer {
        const tx = transaction.get();
        //signature hashの生成
        //signature hash = sha256(version + in_count + in_list + out_count + out_list + lock_time + signature hash types)
        let sha256;
        const sigHashOriginal = `${tx.version}${tx.txIn.length}${JSON.stringify(tx.txIn)}${tx.txOut.length}${JSON.stringify(tx.txOut)}${tx.locktime}${this.hashType}`;
        sha256 = crypto.createHash('sha256');
        sha256.setEncoding('binary');
        sha256.write(sigHashOriginal);
        sha256.end();
        const signatureHash: Buffer = Buffer.from(sha256.read().toString(), 'binary');
        return signatureHash;
    }
    getScriptSig(transaction: Transaction): Buffer {
        //ScriptSig: <Signature A> <PublicKey A>
        //
        //signature hashの生成
        const signatureHash: Buffer = this.getSignatureHash(transaction);

        //ECDSA署名によるsignatureの生成
        //signature = ECDSA(signatureHash, privateKey) + signature hash types
        const sign = secp256k1.sign(
            signatureHash,
            Buffer.from(this.account.getKeyPair.getKeys().privateKey)
        );
        const signature = sign.signature.toString('hex') + this.hashType;

        //ScriptSigの生成
        //ScriptSig = `${signature} ${publicKey}`
        const scriptSig = `${signature} ${this.account.getKeyPair.getKeys().publicKey.toString('hex')}`;

        const result = Buffer.from(scriptSig);
        return result;
    }
    run(transaction: Transaction, scriptSig: Buffer, scriptPubKey: Buffer): Boolean {
        //<Signature A> <PublicKey A> OP_DUP OP_HASH256 <PublicKey Hash A>  OP_EQUALVERIFY OP_CHECKSIG

        const transactionScript = `${scriptSig} ${scriptPubKey}`;
        const dataList = transactionScript.split(' ');
        //console.log(dataList);
        let stackArray = new Array;
        for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];
            switch (data) {
                case 'OP_DUP':
                    stackArray.push(stackArray[stackArray.length - 1]);
                    //console.log(`OP_DUP stack: ${stackArray}`);
                    break;
                case 'OP_HASH256':
                    const sha256 = crypto.createHash('sha256');
                    sha256.setEncoding('hex');
                    sha256.write(Buffer.from(stackArray[stackArray.length - 1], 'hex').toString('hex'));
                    sha256.end();
                    const pubKeyHashA = sha256.read().toString('hex');
                    stackArray.pop();
                    stackArray.push(pubKeyHashA);
                    //console.log(`OP_HASH256 stack: ${stackArray}`);
                    break;
                case 'OP_EQUALVERIFY':
                    const upper = stackArray[stackArray.length - 1];
                    const lower = stackArray[stackArray.length - 2];
                    if (upper !== lower) {
                        return false;
                    }
                    stackArray.pop();
                    stackArray.pop();
                    //console.log(`OP_EQUALVERIFY stack: ${stackArray}`);
                    break;
                case 'OP_CHECKSIG':
                    const scriptSigPublicKeyA = Buffer.from(stackArray[stackArray.length - 1], 'hex');
                    const scriptSigSignature = stackArray[stackArray.length - 2];
                    stackArray.pop();
                    stackArray.pop();
                    const scriptSigRawSignature = scriptSigSignature.slice(0, scriptSigSignature.indexOf(this.hashType));
                    const scriptSigSignatureBuffer = Buffer.from(scriptSigRawSignature, 'hex');
                    const signatureHash = this.getSignatureHash(transaction);
                    //console.log(`signatureHash:            ${signatureHash.toString('hex')}`)
                    //console.log(`scriptSigSignatureBuffer: ${scriptSigSignatureBuffer.toString('hex')}`);
                    //console.log(`scriptSigPublicKeyA:      ${scriptSigPublicKeyA.toString('hex')}`);
                    const result = secp256k1.verify(
                        signatureHash,
                        scriptSigSignatureBuffer,
                        scriptSigPublicKeyA
                    );
                    stackArray.push(result);
                    //console.log(`OP_CHECKSIG stack: ${stackArray}`);
                    break;
                default:
                    //data
                    stackArray.push(data);
                    //console.log(`DATA stack: ${stackArray}`);
                    break;
            }
        }
        const result = stackArray[stackArray.length - 1];
        stackArray.pop();
        if (stackArray.length > 0) {
            return false;
        }
        return result;
    }
}
