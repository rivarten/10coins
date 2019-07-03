import * as crypto from 'crypto';
import * as secp256k1 from 'secp256k1';

export interface CryptoKeys {
    publicKey: Buffer;
    privateKey: Buffer;
}
const CryptoKeysDefault: CryptoKeys = {
    publicKey: Buffer.from(''),
    privateKey: Buffer.from(''),
};
export interface KeyPairInterface {
    generateKeys(): CryptoKeys;
    getKeys(): CryptoKeys;
}
export class KeyPair implements KeyPairInterface {
    private keys: CryptoKeys = CryptoKeysDefault;
    constructor() {
    }
    generateKeys(): CryptoKeys {
        let privKey;
        do {
            privKey = crypto.randomBytes(32);
        } while (!secp256k1.privateKeyVerify(privKey));
        const publicKey = secp256k1.publicKeyCreate(privKey);
        const privateKey = privKey;

        this.keys = {
            publicKey: publicKey,
            privateKey: privateKey,
        };
        return this.keys;
    }
    getKeys(): CryptoKeys {
        return this.keys;
    }
}
const KeyPairDefault: KeyPair = new KeyPair();

export class Account {
    private address: string;
    private keys: KeyPair = KeyPairDefault;
    convertToAddressFromKeyPair(keyPair: KeyPair): string {
        const sha256 = crypto.createHash('sha256');
        sha256.setEncoding('hex');
        sha256.write(keyPair.getKeys().publicKey.toString('hex'));
        sha256.end();
        return sha256.read().toString();
    }
    constructor(keyPair: KeyPair = KeyPairDefault) {
        if (!keyPair) {
            this.address = this.getNewAddress();
        } else {
            this.keys = keyPair;
            this.address = this.convertToAddressFromKeyPair(keyPair);
        }
    }
    getNewAddress(): string {
        this.keys.generateKeys();
        this.address = this.convertToAddressFromKeyPair(this.keys);
        return this.address;
    }
    getAddress(): string {
        return this.address;
    }
    get getKeyPair(): KeyPair {
        return this.keys;
    }
}
