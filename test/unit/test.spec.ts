import { Transaction } from '../../src/models/transaction';
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
                -0.5,
                'from',
                'to',
            );
            expect(transactionA instanceof Transaction).toEqual(true);
            let transactionB = new Transaction();
            expect(transactionB instanceof Transaction).toEqual(true);
        });
        it('トランザクションの内容を取得', () => {
            let transactionA = new Transaction(
                1,
                -0.5,
                'from',
                'to',
            );
            expect(transactionA.get()).toEqual({
                amount: 1,
                fee: -0.5,
                from: 'from',
                to: 'to',
            });
            let transactionB = new Transaction();
            expect(transactionB.get()).toEqual({
                amount: 0,
                fee: 0,
                from: '',
                to: '',
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
                let myAccount = new Account(myKeyPair);
                expect(myAccount instanceof Account).toEqual(true);
                expect(myAccount.getAddress()).toEqual(myAccount.convertToAddressFromKeyPair(myKeyPair));
            });
        });
        describe('ノード管理', () => {
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
        describe('トランザクションのブロードキャスト', () => {
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
    });
    describe('マイニング', () => {
        describe('ブロック管理', () => {
            it('ブロック作成', () => {
                let block = new Block();
                expect(block instanceof Block).toEqual(true);
            });
            it('ブロックにトランザクションを追加', () => {
                let transaction = new Transaction(
                    1,
                    -0.5,
                    'from',
                    'to',
                );
                let block = new Block();
                expect(block instanceof Block).toEqual(true);
                block.addTransaction(transaction);
                expect(block.getTransactions()).toEqual([transaction]);
            });
            it('ブロックに複数のトランザクションを追加', () => {
                let transaction1 = new Transaction(
                    1,
                    -0.5,
                    'from',
                    'to',
                );
                let transaction2 = new Transaction(
                    2,
                    -0.5,
                    'from',
                    'to',
                );
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
                transaction1 = new Transaction(
                    1,
                    -0.5,
                    'from',
                    'to',
                );
                transaction2 = new Transaction(
                    2,
                    -0.5,
                    'from',
                    'to',
                );
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
    describe('ブロックチェーンに取り込み', () => {
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
});
