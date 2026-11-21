const assert = require('node:assert/strict');
const test = require('node:test');
const ledger = require('../lib/ledger');

function customerLedger() {
  return {
    customers: [{ id: 1, name: 'Meera Joshi', totalBilled: 2432.01, totalSettled: 1200 }],
    nextSettlementId: 1
  };
}

test('a settlement submitted as text adds to the total and reduces the balance', () => {
  const db = customerLedger();
  const result = ledger.recordSettlement(db, 1, '500');

  assert.equal(result.ok, true);
  assert.equal(result.customer.totalSettled, 1700);
  assert.equal(result.customer.balance, 732.01);
  assert.equal(result.settlement.amount, 500);
  assert.equal(ledger.listCustomers(db)[0].balance, 732.01);
});

test('a settlement adds to a legacy total stored as text', () => {
  const db = customerLedger();
  db.customers[0].totalSettled = '1200';

  const result = ledger.recordSettlement(db, 1, 0.25);

  assert.equal(result.customer.totalSettled, 1200.25);
  assert.equal(result.customer.balance, 1231.76);
});

test('invalid settlement amounts leave the ledger unchanged', () => {
  for (const amount of ['invalid', 'Infinity', ' ', 0, -1, true, [500]]) {
    const db = customerLedger();
    assert.equal(ledger.recordSettlement(db, 1, amount).ok, false);
    assert.deepEqual(db, customerLedger());
  }
});
