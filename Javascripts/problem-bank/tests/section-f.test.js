'use strict';
// Tests for Problem Bank Section F: TypeScript & Advanced Design Patterns
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const {
  createTypedEventEmitter,
  Ok, Err, ok, err,
  createLRUCache,
  Container,
  createStateMachine,
  createSchema,
  createObservable,
  createCommandBus
} = require('../solution/section-f-typescript-advanced.solution.js');

// ─── P41: Typed Event Emitter ─────────────────────────────────────────────────
describe('P41: createTypedEventEmitter', () => {
  it('on() → handler receives payload', () => {
    const e = createTypedEventEmitter();
    const received = [];
    e.on('msg', v => received.push(v));
    e.emit('msg', 'hello');
    e.emit('msg', 'world');
    assert.deepEqual(received, ['hello', 'world']);
  });

  it('on() returns unsubscribe; further emits are silent', () => {
    const e = createTypedEventEmitter();
    const log = [];
    const unsub = e.on('tick', v => log.push(v));
    e.emit('tick', 1);
    unsub();
    e.emit('tick', 2);
    assert.deepEqual(log, [1]);
  });

  it('once() fires exactly once', () => {
    const e = createTypedEventEmitter();
    const calls = [];
    e.once('ready', v => calls.push(v));
    e.emit('ready', 'a');
    e.emit('ready', 'b');
    assert.deepEqual(calls, ['a']);
  });

  it('off() removes specific handler', () => {
    const e = createTypedEventEmitter();
    const log = [];
    const h1 = v => log.push('h1:' + v);
    const h2 = v => log.push('h2:' + v);
    e.on('x', h1);
    e.on('x', h2);
    e.off('x', h1);
    e.emit('x', '!');
    assert.deepEqual(log, ['h2:!']);
  });
});

// ─── P42: Result Monad ────────────────────────────────────────────────────────
describe('P42: Result monad', () => {
  it('ok().map() transforms value', () => {
    const r = ok(5).map(n => n * 2);
    assert.ok(r.isOk());
    assert.equal(r.value, 10);
  });

  it('err().map() is a no-op', () => {
    const r = err(new Error('bad')).map(n => n * 2);
    assert.ok(r.isErr());
  });

  it('flatMap() chains results', () => {
    const r = ok(10).flatMap(n => n > 5 ? ok(n + 1) : err(new Error('small')));
    assert.equal(r.value, 11);
  });

  it('flatMap() short-circuits on Err', () => {
    const r = ok(1).flatMap(() => err(new Error('oops'))).flatMap(n => ok(n + 9999));
    assert.ok(r.isErr());
  });

  it('mapError() transforms error', () => {
    const r = err(new Error('orig')).mapError(e => new Error('wrapped: ' + e.message));
    assert.match(r.error.message, /wrapped/);
  });

  it('unwrapOr() returns default on Err', () => {
    assert.equal(err(new Error('x')).unwrapOr(42), 42);
    assert.equal(ok(7).unwrapOr(42), 7);
  });
});

// ─── P43: LRU Cache ───────────────────────────────────────────────────────────
describe('P43: createLRUCache', () => {
  it('stores and retrieves values', () => {
    const c = createLRUCache({ maxSize: 5 });
    c.set('a', 1);
    assert.equal(c.get('a'), 1);
  });

  it('evicts least-recently-used entry at capacity', () => {
    const c = createLRUCache({ maxSize: 3 });
    c.set('a', 1); c.set('b', 2); c.set('c', 3);
    c.get('a');          // promote a → LRU is now b
    c.set('d', 4);       // should evict b
    assert.equal(c.get('b'), undefined);
    assert.equal(c.get('a'), 1);
    assert.equal(c.get('d'), 4);
  });

  it('respects TTL and returns undefined for expired entries', async () => {
    const c = createLRUCache({ maxSize: 10, ttlMs: 30 });
    c.set('x', 99);
    assert.equal(c.get('x'), 99);
    await new Promise(r => setTimeout(r, 50));
    assert.equal(c.get('x'), undefined);
  });

  it('size() reflects current count', () => {
    const c = createLRUCache({ maxSize: 10 });
    c.set('a', 1); c.set('b', 2);
    assert.equal(c.size(), 2);
    c.delete('a');
    assert.equal(c.size(), 1);
  });
});

// ─── P44: DI Container ────────────────────────────────────────────────────────
describe('P44: Container', () => {
  it('singleton: same instance each call', () => {
    const c = new Container();
    const T = Symbol('T');
    c.register(T, () => ({ id: Math.random() }), { singleton: true });
    const a = c.resolve(T);
    const b = c.resolve(T);
    assert.strictEqual(a, b);
  });

  it('transient: new instance each call', () => {
    const c = new Container();
    const T = Symbol('T');
    c.register(T, () => ({ id: Math.random() }), { singleton: false });
    const a = c.resolve(T);
    const b = c.resolve(T);
    assert.notStrictEqual(a, b);
  });

  it('throws if token not registered', () => {
    const c = new Container();
    assert.throws(() => c.resolve(Symbol('X')), /not registered/i);
  });

  it('factory receives container for nested resolution', () => {
    const c = new Container();
    const A = Symbol('A');
    const B = Symbol('B');
    c.register(A, () => 'value-a');
    c.register(B, ctr => ({ a: ctr.resolve(A) }));
    assert.equal(c.resolve(B).a, 'value-a');
  });
});

// ─── P45: State Machine ───────────────────────────────────────────────────────
describe('P45: createStateMachine', () => {
  function makeOrder() {
    return createStateMachine({
      initial: 'pending',
      transitions: { pending: ['confirmed', 'cancelled'], confirmed: ['shipped'], shipped: ['delivered'] }
    });
  }

  it('transitions to allowed state', () => {
    const sm = makeOrder();
    const r = sm.transition('confirmed');
    assert.ok(r.isOk());
    assert.equal(sm.getState(), 'confirmed');
  });

  it('rejects illegal transitions', () => {
    const sm = makeOrder();
    const r = sm.transition('delivered');
    assert.ok(r.isErr());
    assert.equal(sm.getState(), 'pending');
  });

  it('can() indicates feasibility without mutating state', () => {
    const sm = makeOrder();
    assert.ok(sm.can('confirmed'));
    assert.ok(!sm.can('shipped'));
  });

  it('guard rejects transition when predicate is false', () => {
    const sm = makeOrder();
    sm.addGuard('pending', 'confirmed', ctx => ctx.paymentSuccess === true);
    const r = sm.transition('confirmed', { paymentSuccess: false });
    assert.ok(r.isErr());
  });
});

// ─── P46: Schema Validator ────────────────────────────────────────────────────
describe('P46: createSchema', () => {
  const schema = createSchema({
    name:  { type: 'string', required: true, min: 2, max: 50 },
    age:   { type: 'number', required: true, min: 0, max: 120 },
    email: { type: 'string', required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  });

  it('valid data passes', () => {
    const r = schema.validate({ name: 'Alice', age: 30, email: 'a@b.com' });
    assert.ok(r.valid);
    assert.equal(r.errors.length, 0);
  });

  it('missing required field fails', () => {
    const r = schema.validate({ age: 25 });
    assert.ok(!r.valid);
    assert.ok(r.errors.some(e => e.includes('name')));
  });

  it('type mismatch fails', () => {
    const r = schema.validate({ name: 'Bo', age: 'old' });
    assert.ok(!r.valid);
    assert.ok(r.errors.some(e => e.includes('age')));
  });

  it('pattern violation fails', () => {
    const r = schema.validate({ name: 'Bo', age: 20, email: 'notanemail' });
    assert.ok(!r.valid);
  });

  it('optional missing field passes', () => {
    const r = schema.validate({ name: 'Bo', age: 20 });
    assert.ok(r.valid);
  });
});

// ─── P47: Observable ──────────────────────────────────────────────────────────
describe('P47: createObservable', () => {
  function fromArray(arr) {
    return createObservable(sink => {
      arr.forEach(v => sink.next(v));
      sink.complete();
    });
  }

  it('subscribe receives all values then complete', () => new Promise(resolve => {
    const vals = [];
    fromArray([1, 2, 3]).subscribe({
      next: v => vals.push(v),
      complete: () => { assert.deepEqual(vals, [1, 2, 3]); resolve(); }
    });
  }));

  it('map() transforms values', () => new Promise(resolve => {
    const vals = [];
    fromArray([1, 2]).map(n => n * 10).subscribe({
      next: v => vals.push(v),
      complete: () => { assert.deepEqual(vals, [10, 20]); resolve(); }
    });
  }));

  it('filter() drops unmatched values', () => new Promise(resolve => {
    const vals = [];
    fromArray([1, 2, 3, 4]).filter(n => n % 2 === 0).subscribe({
      next: v => vals.push(v),
      complete: () => { assert.deepEqual(vals, [2, 4]); resolve(); }
    });
  }));

  it('take(n) emits exactly n values then completes', () => new Promise(resolve => {
    const vals = [];
    fromArray([1, 2, 3, 4, 5]).take(3).subscribe({
      next: v => vals.push(v),
      complete: () => { assert.deepEqual(vals, [1, 2, 3]); resolve(); }
    });
  }));
});

// ─── P48: Command Bus ─────────────────────────────────────────────────────────
describe('P48: createCommandBus', () => {
  it('executes registered handler', async () => {
    const bus = createCommandBus();
    bus.register('GREET', async ({ name }) => `Hello, ${name}!`);
    const result = await bus.execute({ type: 'GREET', payload: { name: 'Alice' } });
    assert.equal(result, 'Hello, Alice!');
  });

  it('throws for unregistered command', async () => {
    const bus = createCommandBus();
    await assert.rejects(() => bus.execute({ type: 'UNKNOWN', payload: {} }), /No handler/i);
  });

  it('throws when duplicate handler registered', () => {
    const bus = createCommandBus();
    bus.register('CMD', async () => 1);
    assert.throws(() => bus.register('CMD', async () => 2), /already registered/i);
  });

  it('unregister function removes handler', async () => {
    const bus = createCommandBus();
    const unregister = bus.register('TMP', async () => 'ran');
    assert.ok(bus.has('TMP'));
    unregister();
    assert.ok(!bus.has('TMP'));
  });
});
