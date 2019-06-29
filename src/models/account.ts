import * as crypto from 'crypto';

export interface CryptoKeys {
    publicKey: string;
    privateKey: string;
}
const CryptoKeysDefault: CryptoKeys = {
    publicKey: '',
    privateKey: '',
};
export interface KeyPairInterface {
    generateKeys(): CryptoKeys;
    getKeys(): CryptoKeys;
}
export class KeyPair implements KeyPairInterface {
    private keys: CryptoKeys = CryptoKeysDefault;
    readonly ecdhType: string = 'secp256k1';
    constructor() {
    }
    generateKeys(): CryptoKeys {
        const ecdh = crypto.createECDH(this.ecdhType);
        ecdh.generateKeys();
        const publicKey = ecdh.getPublicKey('hex');
        const privateKey = ecdh.getPrivateKey('hex');
        this.keys = {
            publicKey,
            privateKey,
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
        sha256.write(keyPair.getKeys().publicKey);
        sha256.end();
        return sha256.read().toString();
    }
    constructor(keyPair: KeyPair = KeyPairDefault) {
        if (!keyPair) {
            this.address = this.getNewAddress();
        } else {
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
}
