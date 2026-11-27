import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addToCartState,
  clearCartState,
  formatCurrency,
  getCartTotals,
  safeParseCartStorage,
  setItemQuantityState,
  type CartItem,
} from './cartLogic';

const sampleStrawberry: Omit<CartItem, 'quantity'> = {
  id: 'strawberry',
  name: 'Strawberry Swirl',
  price: 6.5,
  image: '/cup_strawberry.jpg',
  accentColor: '#e86f8c',
};

const samplePistachio: Omit<CartItem, 'quantity'> = {
  id: 'pistachio',
  name: 'Roasted Pistachio',
  price: 7.5,
  image: '/cup_pistachio.jpg',
  accentColor: '#7ea86e',
};

test('addToCartState adds new items and increments existing quantities', () => {
  let state = addToCartState([], sampleStrawberry);
  assert.equal(state.length, 1);
  assert.equal(state[0].quantity, 1);

  state = addToCartState(state, sampleStrawberry, 2);
  assert.equal(state.length, 1);
  assert.equal(state[0].quantity, 3);

  state = addToCartState(state, samplePistachio, 1);
  assert.equal(state.length, 2);
  assert.equal(state[1].id, 'pistachio');
});

test('setItemQuantityState updates quantity and removes item when zero or negative', () => {
  let state = addToCartState([], sampleStrawberry, 2);
  state = addToCartState(state, samplePistachio, 1);

  state = setItemQuantityState(state, 'strawberry', 5);
  assert.equal(state[0].quantity, 5);

  state = setItemQuantityState(state, 'strawberry', 0);
  assert.equal(state.length, 1);
  assert.equal(state[0].id, 'pistachio');
});

test('getCartTotals calculates exact count and subtotal', () => {
  let state = addToCartState([], sampleStrawberry, 2); // 13.00
  state = addToCartState(state, samplePistachio, 3); // 22.50
  const totals = getCartTotals(state);
  assert.equal(totals.totalCount, 5);
  assert.equal(totals.subtotal, 35.5);
  assert.equal(formatCurrency(totals.subtotal), '$35.50');
});

test('clearCartState empties the cart', () => {
  const cleared = clearCartState();
  assert.deepEqual(cleared, []);
});

test('safeParseCartStorage rejects invalid JSON and filters malformed items', () => {
  assert.deepEqual(safeParseCartStorage('not-json'), []);
  assert.deepEqual(safeParseCartStorage('{"bad":true}'), []);
  const validPayload = JSON.stringify([
    { ...sampleStrawberry, quantity: 2 },
    { id: 'broken', price: 'free', quantity: 1 },
    { ...samplePistachio, quantity: 0 },
  ]);
  const parsed = safeParseCartStorage(validPayload);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, 'strawberry');
});
