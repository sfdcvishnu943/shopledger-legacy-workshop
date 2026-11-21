const assert = require('node:assert/strict');
const test = require('node:test');
const orders = require('../lib/orders');

const db = {
  orders: [
    { id: 1001, date: '28/12/2021' },
    { id: 1004, date: '30/01/2022' },
    { id: 1007, date: '01/03/2022' },
    { id: 1008, date: '2022-03-15' },
    { id: 1009, date: '15/03/2022' },
    { id: 1010, date: '01/04/2022' }
  ]
};

test('order history lists newest orders first across months and years', () => {
  assert.deepEqual(orders.list(db).map(order => order.id),
    [1010, 1009, 1008, 1007, 1004, 1001]);
});

test('order history filters inclusively with either date format or one bound', () => {
  assert.deepEqual(orders.list(db, { from: '2022-03-01', to: '15/03/2022' })
    .map(order => order.id), [1009, 1008, 1007]);
  assert.deepEqual(orders.list(db, { from: '2022-04-01' }).map(order => order.id), [1010]);
  assert.deepEqual(orders.list(db, { to: '2022-01-30' }).map(order => order.id), [1004, 1001]);
});
