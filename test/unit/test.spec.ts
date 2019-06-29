import { Transaction } from '../../src/models/transaction';
import { Account, CryptoKeys, KeyPair } from '../../src/models/account';
//console.log = jest.fn();

describe('', () => {
    beforeEach(() => {
    });
    afterEach(() => {
    });
    describe('トランザクションを生成', () => {
        it('トランザクションを生成', () => {
            let transaction = new Transaction(
                1,
                -0.5,
                'from',
                'to',
            );
            expect(transaction instanceof Transaction).toEqual(true);
        });
        it('トランザクションの内容を取得', () => {
            let transaction = new Transaction(
                1,
                -0.5,
                'from',
                'to',
            );
            expect(transaction.get()).toEqual({
                amount: 1,
                fee: -0.5,
                from: 'from',
                to: 'to',
            });
        });
    });
    describe('トランザクションを配布', () => {
        describe('アカウント管理', () => {
            it('自分のアカウント作成', () => {
                let myAccount = new Account();
                expect(myAccount instanceof Account).toEqual(true);
            });
            it('公開鍵暗号/楕円曲線暗号/secp256k1のペア生成', () => {
                let myKeyPair = new KeyPair();
                const generatedKeys: CryptoKeys = myKeyPair.generateKeys();
                const gotKeys: CryptoKeys = myKeyPair.getKeys();
                expect(generatedKeys).toEqual(gotKeys);
            });
            it('自分のアカウントのアドレスを生成・取得', () => {
                let myAccount = new Account();
                expect(myAccount instanceof Account).toEqual(true);
                expect(typeof myAccount.getAddress()).toEqual('string');
            });
            it('自分のアカウントのアドレスを設定', () => {
                const myKeyPair = new KeyPair();
                let myAccount = new Account(myKeyPair);
                expect(myAccount instanceof Account).toEqual(true);
                expect(myAccount.getAddress()).toEqual(myAccount.convertToAddressFromKeyPair(myKeyPair));
            });
        });
    });
    xit('マイニング', () => {
    });
    xit('ブロックチェーンに取り込み', () => {
    });
});
