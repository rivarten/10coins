import { Transaction } from '../../src/models/transaction';
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
    });
    xit('マイニング', () => {
    });
    xit('ブロックチェーンに取り込み', () => {
    });
});
