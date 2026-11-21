const assert = require('node:assert/strict');
const test = require('node:test');
const inventory = require('../lib/inventory');
const orders = require('../lib/orders');

test('checkout can sell the last available unit with wholesale stock held', () => {
  const products = [{ id: 1, name: 'Chilli powder', stock: 4, reserved: 3 }];
  const items = [{ id: 1, qty: 1 }];

  assert.equal(inventory.check(products, items).ok, true);
  inventory.reserve(products, items);
  assert.equal(inventory.getSellableStock(products[0]), 0);
});

test('checkout rejects quantities above sellable stock across duplicate lines', () => {
  const products = [{ id: 1, name: 'Chilli powder', stock: 6, reserved: 3 }];
  const items = [{ id: 1, qty: 2 }, { id: '1', qty: 2 }];

  assert.equal(inventory.check(products, items).ok, false);
});

test('cancelling a pending order restores physical stock exactly once', () => {
  const product = { id: 1, stock: 6, reserved: 3 };
  const items = [{ id: 1, qty: 2 }];
  const db = { products: [product], orders: [], nextOrderId: 1007 };

  inventory.reserve(db.products, items);
  const order = orders.add(db, { items, status: 'pending' });
  assert.equal(product.stock, 4);
  assert.equal(orders.cancel(db, order.id).ok, true);
  assert.equal(order.status, 'cancelled');
  assert.equal(product.stock, 6);
  assert.equal(product.reserved, 3);

  assert.equal(orders.cancel(db, order.id).ok, false);
  assert.equal(product.stock, 6);
});
