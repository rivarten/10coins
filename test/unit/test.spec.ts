import * as crypto from 'crypto';

import {
    Transaction,
    TransactionOutputElem,
    TransactionInputElemNonCoinBase,
    TransactionInputElemCoinBase,
    Script_P2PKH,
} from '../../src/models/transaction';
import { Account, CryptoKeys, KeyPair } from '../../src/models/account';
import { Block, BlockHeader } from '../../src/models/block';

//console.log = jest.fn();

describe('', () => {
    beforeEach(() => {
    });
    afterEach(() => {
    });
    describe('トランザクションを生成', () => {
        it('トランザクションを生成', () => {
            let transactionA = new Transaction(
                1,
                2,
            );
            expect(transactionA instanceof Transaction).toEqual(true);
            let transactionB = new Transaction();
            expect(transactionB instanceof Transaction).toEqual(true);
        });
        it('トランザクションの内容を取得', () => {
            let transactionA = new Transaction(
                1,
                2,
            );
            expect(transactionA.get()).toEqual({
                version: 1,
                locktime: 2,
                txIn: [],
                txOut: [],
            });
            let transactionB = new Transaction();
            expect(transactionB.get()).toEqual({
                version: 1,
                locktime: 0,
                txIn: [],
                txOut: [],
            });
        });
        it('トランザクションのアウトプット要素生成', () => {
            let transactionOutElem = new TransactionOutputElem();
            expect(transactionOutElem instanceof TransactionOutputElem).toEqual(true);
        });
        it('トランザクションのアウトプット要素生成・取得', () => {
            const scriptPubKey = 'script pub key';
            let transactionOutElem = new TransactionOutputElem(
                1,
                scriptPubKey.length,
                scriptPubKey,
            );
            expect(transactionOutElem instanceof TransactionOutputElem).toEqual(true);
            expect(transactionOutElem.getData()).toEqual({
                value: 1,
                scriptPubKeyBytes: scriptPubKey.length,
                scriptPubKey: scriptPubKey,
            });
        });
        it('トランザクションのインプット要素生成', () => {
            let transactionInElem = new TransactionInputElemNonCoinBase();
            expect(transactionInElem instanceof TransactionInputElemNonCoinBase).toEqual(true);
        });
        it('トランザクションのインプット要素生成・取得', () => {
            const scriptSig = 'script sig';
            let transactionInElem = new TransactionInputElemNonCoinBase(
                'hash',
                1,
                scriptSig.length,
                scriptSig,
                2
            );
            expect(transactionInElem instanceof TransactionInputElemNonCoinBase).toEqual(true);
            expect(transactionInElem.getData()).toEqual({
                hash: 'hash',
                index: 1,
                scriptBytes: scriptSig.length,
                scriptSig: scriptSig,
                sequence: 2,
            });
        });
        it('トランザクションのインプット要素生成(コインベース', () => {
            let transactionInElem = new TransactionInputElemCoinBase();
            expect(transactionInElem instanceof TransactionInputElemCoinBase).toEqual(true);
        });
        it('トランザクションのインプット要素生成・取得(コインベース', () => {
            const coinbaseData = 'coinbase data';
            let transactionInElem = new TransactionInputElemCoinBase(
                1,
                coinbaseData.length,
                coinbaseData,
                2
            );
            expect(transactionInElem instanceof TransactionInputElemCoinBase).toEqual(true);
            expect(transactionInElem.getData()).toEqual({
                hash: '',
                index: 1,
                coinbaseDataBytes: coinbaseData.length,
                coinbaseData: coinbaseData,
                sequence: 2,
            });
        });
        xit('トランザクションのインプット要素追加(非コインベース', () => {
        });
        it('トランザクションのインプット要素追加(コインベース', () => {
            const coinbaseData = 'coinbase data';
            let transactionInElem = new TransactionInputElemCoinBase(
                1,
                coinbaseData.length,
                coinbaseData,
                2
            );
            let transaction = new Transaction();
            transaction.addTransactionIn(transactionInElem);
            expect(transaction.get()).toEqual({
                version: 1,
                locktime: 0,
                txIn: [transactionInElem],
                txOut: [],
            });
        });
        it('トランザクションのアウトプット要素追加', () => {
            const scriptPubKey = 'script pub key';
            let transactionOutElem = new TransactionOutputElem(
                1,
                scriptPubKey.length,
                scriptPubKey,
            );
            let transaction = new Transaction();
            transaction.addTransactionOut(transactionOutElem);
            expect(transaction.get()).toEqual({
                version: 1,
                locktime: 0,
                txIn: [],
                txOut: [transactionOutElem],
            });
        });
    });
    describe('トランザクションをブロードキャスト', () => {
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
                myKeyPair.generateKeys();
                let myAccount = new Account(myKeyPair);
                expect(myAccount instanceof Account).toEqual(true);
                expect(myAccount.getAddress()).toEqual(myAccount.convertToAddressFromKeyPair(myKeyPair));
            });
        });
        xdescribe('ノード管理', () => {
            describe('初期接続確立', () => {
                it('DNSシードに問い合わせ', () => {
                });
                it('デフォルトポートでフルノードを起動', () => {
                });
                it('DNSシードのIPアドレスリストに、フルノードを登録', () => {
                });
                it('DNSシードから返ってきたフルノードのIPリストから、１つ選んで接続する', () => {
                });
                it('フルノードのIPリストすべて接続不可能な場合、ハードコードされたIPリストの中から選んで接続する', () => {
                });
                it('getnetworkinfoで、自分のノードがどのプロトコルバージョンをサポートしているかを取得', () => {
                });
                describe('ハンドシェイク', () => {
                    it('version送信', () => {
                    });
                    it('version受信', () => {
                    });
                    it('verack送信', () => {
                    });
                    it('verack受信', () => {
                    });
                });
                describe('他のノードの検出', () => {
                    it('getaddr送信', () => {
                    });
                    it('addr返信', () => {
                    });
                });
                describe('初期ブロックダウンロード(Initial Block Download)', () => {
                    it('getheaders送信', () => {
                    });
                    it('headers返信', () => {
                    });
                    it('getheaders -- headers送受信', () => {
                    });
                    it('getdata送信', () => {
                    });
                    it('block返信', () => {
                    });
                });
            });
        });
        xdescribe('トランザクションのブロードキャスト', () => {
            it('inv送信', () => {
            });
            it('getdata返信', () => {
            });
            it('tx送信', () => {
            });
            it('受け取ったトランザクションをメモリプールに格納', () => {
            });
            xit('ノードシャットダウン時にメモリプールのトランザクションをディスクに保存', () => {
            });
            xit('ノード起動時にディスクに保存されているトランザクションをメモリプールに復元', () => {
            });
        });
        describe('トランザクションスクリプト: P2PKH', () => {
            //ScriptPubKey: 本当は, OP_DUP OP_HASH160 <PublicKey Hash A>  OP_EQUALVERIFY OP_CHECKSIG
            //              ここでは, OP_DUP OP_HASH256 <PublicKey Hash A>  OP_EQUALVERIFY OP_CHECKSIG
            //
            //ScriptSig: <Signature A> <PublicKey A>
            it('ScriptPubKey(locking script)を作成', () => {
                const myKeyPair = new KeyPair();
                myKeyPair.generateKeys();
                let myAccount = new Account(myKeyPair);

                const pubKeyA = myKeyPair.getKeys().publicKey.toString('hex');
                const sha256 = crypto.createHash('sha256');
                sha256.setEncoding('hex');
                sha256.write(pubKeyA);
                sha256.end();
                const pubKeyHashA = sha256.read().toString();

                let script = new Script_P2PKH(myAccount);
                expect(script instanceof Script_P2PKH).toEqual(true);
                expect(script.getScriptPubKey()).toEqual(
                    Buffer.from(`OP_DUP OP_HASH256 ${pubKeyHashA} OP_EQUALVERIFY OP_CHECKSIG`)
                );
            });
            it('ScriptSig(unlocking script)を作成', () => {
                const myKeyPair = new KeyPair();
                myKeyPair.generateKeys();
                let myAccount = new Account(myKeyPair);

                let script = new Script_P2PKH(myAccount);
                expect(script instanceof Script_P2PKH).toEqual(true);

                //トランザクション作成
                let transaction = new Transaction();
                    //In: コインベース
                const coinbaseData = 'coinbase data';
                let transactionInElem = new TransactionInputElemCoinBase(
                    1,
                    coinbaseData.length,
                    coinbaseData,
                    2
                );
                transaction.addTransactionIn(transactionInElem);
                    //Out:
                const scriptPubKey = script.getScriptPubKey();
                let transactionOutElem = new TransactionOutputElem(
                    1,
                    scriptPubKey.toString().length,
                    scriptPubKey.toString(),
                );
                transaction.addTransactionOut(transactionOutElem);

                //
                const scriptSig = script.getScriptSig(transaction);
                expect(typeof scriptSig).toEqual('object');
            });
            it('トランザクションスクリプトの実行', () => {
                const myKeyPair = new KeyPair();
                myKeyPair.generateKeys();
                let myAccount = new Account(myKeyPair);

                let script = new Script_P2PKH(myAccount);
                expect(script instanceof Script_P2PKH).toEqual(true);

                //トランザクション作成
                let transaction = new Transaction();
                    //In: コインベース
                const coinbaseData = 'coinbase data';
                let transactionInElem = new TransactionInputElemCoinBase(
                    1,
                    coinbaseData.length,
                    coinbaseData,
                    2
                );
                transaction.addTransactionIn(transactionInElem);
                    //Out:
                const scriptPubKey = script.getScriptPubKey();
                let transactionOutElem = new TransactionOutputElem(
                    1,
                    scriptPubKey.toString().length,
                    scriptPubKey.toString(),
                );
                transaction.addTransactionOut(transactionOutElem);

                //
                const scriptSig = script.getScriptSig(transaction);
                //
                const result = script.run(transaction, scriptSig, scriptPubKey);
                expect(result).toEqual(true);
            });
        });
        xdescribe('トランザクションの検証', () => {
            it('受信したトランザクションに含まれるInputからUTXOを特定', () => {
            });
            it('UTXOからScriptPubKeyを取り出す', () => {
            });
            it('InputからScriptSigを取り出す', () => {
            });
            it('ScriptSig+ScriptPubKeyを実行して検証', () => {
            });
        });
    });
    xdescribe('マイニング', () => {
        describe('ブロック管理', () => {
            it('ブロック作成', () => {
                let block = new Block();
                expect(block instanceof Block).toEqual(true);
            });
            it('ブロックにトランザクションを追加', () => {
                let transaction = new Transaction();
                let block = new Block();
                expect(block instanceof Block).toEqual(true);
                block.addTransaction(transaction);
                expect(block.getTransactions()).toEqual([transaction]);
            });
            it('ブロックに複数のトランザクションを追加', () => {
                let transaction1 = new Transaction();
                let transaction2 = new Transaction();
                let block = new Block();
                block.addTransaction(transaction1);
                block.addTransaction(transaction2);
                expect(block.getTransactions()).toEqual([
                    transaction1,
                    transaction2
                ]);
            });
        });
        describe('マイニング(PoW)', () => {
            let transaction1: Transaction;
            let transaction2: Transaction;
            let block: Block;
            beforeEach(() => {
                transaction1 = new Transaction();
                transaction2 = new Transaction();
                block = new Block();
                block.addTransaction(transaction1);
                block.addTransaction(transaction2);
            });
            it('ブロックヘッダの作成', () => {
                let blockHeader = new BlockHeader();
                expect(blockHeader instanceof BlockHeader).toEqual(true);
            });
            it('ブロックヘッダの内容取得', () => {
                let blockHeader = new BlockHeader(
                    1,
                    'prev block hash',
                    'merkle root hash',
                    2,
                    3,
                    4
                );
                expect(blockHeader instanceof BlockHeader).toEqual(true);
                expect(blockHeader.getData()).toEqual({
                    version: 1,
                    prevBlockHash: 'prev block hash',
                    merkleRootHash: 'merkle root hash',
                    time: 2,
                    difficultyTarget: 3,
                    nonce: 4,
                });
            });
            it('ブロックのマークル木のルートを計算', () => {
                expect(block.getMerkleRoot()).toEqual('block merkle root');
            });
            it('ブロックのシリアライズ', () => {
                expect(block.getSerializedData()).toEqual('serialized block data');
            });
            it('ブロックのハッシュ値取得', () => {
                expect(block.getHash()).toEqual('d7ce8829722f8497980c24d8d1d8f4354f6f738a0637762a4509a0548e5a9180');
            });
        });
    });
    xdescribe('ブロックチェーンに取り込み', () => {
        describe('blockのpush', () => {
        });
        describe('ブロックリレー', () => {
            it('inv送信', () => {
            });
            it('getheaders, getdata返信', () => {
            });
            it('headers, block送信', () => {
            });
            it('受信したブロックの検証', () => {
            });
            it('検証OKならば、ブロックチェーンに追加', () => {
            });
            it('追加後、接続中のノードにinv送信', () => {
            });
        });
    });
    xdescribe('ウォレット', () => {
        describe('ウォレット残高確認', () => {
        });
        describe('送金', () => {
        });
    });
});
