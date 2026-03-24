const test = require('node:test');
const assert = require('node:assert/strict');

function assertUserContract(body) {
  if (typeof body.id !== 'string') throw new Error('id invalid');
  if (typeof body.email !== 'string') throw new Error('email invalid');
}

class BoundedCache {
  constructor(max = 1000) {
    this.max = max;
    this.map = new Map();
  }

  set(k, v) {
    if (this.map.has(k)) this.map.delete(k);
    this.map.set(k, v);
    if (this.map.size > this.max) {
      this.map.delete(this.map.keys().next().value);
    }
  }

  get(k) {
    return this.map.get(k);
  }
}

test('assertUserContract accepts valid payload', () => {
  assert.doesNotThrow(() => assertUserContract({ id: 'u1', email: 'a@b.com' }));
});

test('assertUserContract rejects invalid payload', () => {
  assert.throws(() => assertUserContract({ id: 1, email: 'a@b.com' }), /id invalid/);
  assert.throws(() => assertUserContract({ id: 'u1', email: null }), /email invalid/);
});

test('BoundedCache evicts oldest entry at capacity', () => {
  const cache = new BoundedCache(2);
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);

  assert.equal(cache.get('a'), undefined);
  assert.equal(cache.get('b'), 2);
  assert.equal(cache.get('c'), 3);
});
