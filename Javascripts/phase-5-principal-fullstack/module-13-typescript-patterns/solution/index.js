'use strict';
// Module 13: TypeScript & Advanced Type Patterns — Reference Solution

// ─── 1. Result<T,E> Monad ────────────────────────────────────────────────────
class Ok {
  constructor(value) { this.type = 'ok'; this.value = value; }
  map(fn) { return new Ok(fn(this.value)); }
  flatMap(fn) { return fn(this.value); }
  mapError(_fn) { return this; }
  unwrap() { return this.value; }
  unwrapOr(_def) { return this.value; }
  isOk() { return true; }
  isErr() { return false; }
}

class Err {
  constructor(error) { this.type = 'err'; this.error = error; }
  map(_fn) { return this; }
  flatMap(_fn) { return this; }
  mapError(fn) { return new Err(fn(this.error)); }
  unwrap() { throw this.error; }
  unwrapOr(def) { return def; }
  isOk() { return false; }
  isErr() { return true; }
}

const ok = (value) => new Ok(value);
const err = (error) => new Err(error);

// ─── 2. Discriminated Union Order State Machine ───────────────────────────────
function createOrderStateMachine(initialState = 'pending') {
  const transitions = {
    pending:   ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped:   ['delivered'],
    delivered: [],
    cancelled: []
  };
  let state = initialState;
  return {
    getState() { return state; },
    transition(next) {
      if (!(transitions[state] || []).includes(next))
        return err(new Error(`Invalid transition: ${state} → ${next}`));
      state = next;
      return ok(state);
    },
    canTransition(next) { return (transitions[state] || []).includes(next); }
  };
}

// ─── 3. Branded/Nominal Types ────────────────────────────────────────────────
function createBrand(validator, brandName) {
  return function brand(value) {
    const result = validator(value);
    if (!result.ok) throw new TypeError(`[${brandName}] ${result.error}`);
    return Object.freeze({ __brand: brandName, value });
  };
}

const createEmail = createBrand(
  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    ? { ok: true }
    : { ok: false, error: `"${v}" is not a valid email` },
  'Email'
);

const createPositiveInt = createBrand(
  v => (Number.isInteger(v) && v > 0)
    ? { ok: true }
    : { ok: false, error: `${v} must be a positive integer` },
  'PositiveInt'
);

// ─── 4. Typed Event Emitter ──────────────────────────────────────────────────
function createTypedEventEmitter() {
  const listeners = new Map();

  function on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => listeners.get(event)?.delete(handler);
  }

  function once(event, handler) {
    const unsub = on(event, function wrapper(...args) {
      handler(...args);
      unsub();
    });
    return unsub;
  }

  function emit(event, payload) {
    listeners.get(event)?.forEach(h => h(payload));
  }

  function off(event, handler) {
    listeners.get(event)?.delete(handler);
  }

  return { on, once, off, emit };
}

// ─── 5. Builder Pattern with Validation ─────────────────────────────────────
class UserBuilder {
  #data = {};
  setId(id)       { this.#data.id = id; return this; }
  setName(name)   { this.#data.name = name; return this; }
  setEmail(email) { this.#data.email = email; return this; }
  setRole(role)   { this.#data.role = role; return this; }

  build() {
    const { id, name, email, role } = this.#data;
    const errors = [];
    if (!id) errors.push('id is required');
    if (!name || name.trim().length < 2) errors.push('name must be ≥ 2 characters');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('valid email is required');
    if (!['admin', 'user', 'moderator'].includes(role)) errors.push(`role must be admin|user|moderator, got "${role}"`);
    if (errors.length > 0) return err(new Error(errors.join('; ')));
    return ok({ id, name: name.trim(), email, role, createdAt: new Date().toISOString() });
  }
}

// ─── 6. Generic Memoize with TTL ─────────────────────────────────────────────
function memoize(fn, { keyFn = (...args) => JSON.stringify(args), ttlMs = Infinity } = {}) {
  const cache = new Map();
  return function memoized(...args) {
    const key = keyFn(...args);
    const entry = cache.get(key);
    if (entry && (Date.now() - entry.ts) < ttlMs) return entry.value;
    const value = fn.apply(this, args);
    cache.set(key, { value, ts: Date.now() });
    return value;
  };
}

// ─── 7. Dependency Injection Container ───────────────────────────────────────
class Container {
  #registry  = new Map();
  #instances = new Map();

  register(token, factory, { singleton = true } = {}) {
    this.#registry.set(token, { factory, singleton });
    return this;
  }

  resolve(token) {
    if (!this.#registry.has(token))
      throw new Error(`Container: token not registered — ${String(token)}`);
    const { factory, singleton } = this.#registry.get(token);
    if (singleton) {
      if (!this.#instances.has(token))
        this.#instances.set(token, factory(this));
      return this.#instances.get(token);
    }
    return factory(this);
  }

  reset() { this.#instances.clear(); }
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  // Result monad chaining
  const r = ok(10).map(n => n * 3).flatMap(n => n > 20 ? ok(n) : err(new Error('too small')));
  console.log('Result:', r.isOk() ? r.value : r.error.message);

  // State machine
  const sm = createOrderStateMachine();
  console.log('FSM start:', sm.getState());
  console.log('→ confirmed:', sm.transition('confirmed').isOk());
  console.log('→ delivered (invalid):', sm.transition('delivered').isErr());
  console.log('→ shipped:', sm.transition('shipped').isOk());

  // Branded types
  const email = createEmail('alice@example.com');
  console.log('Branded email:', email.value);
  try { createEmail('not-an-email'); } catch (e) { console.log('Brand rejected:', e.message); }

  // Builder
  const user = new UserBuilder().setId('u1').setName('Alice').setEmail('alice@x.com').setRole('admin').build();
  console.log('User:', user.isOk() ? user.value.name : user.error.message);

  // Memoize
  let calls = 0;
  const slowDouble = memoize((n) => { calls++; return n * 2; });
  slowDouble(5); slowDouble(5); slowDouble(5);
  console.log(`Memoize: calls=${calls} (expected 1)`);

  // DI Container
  const DB = Symbol('DB');
  const Repo = Symbol('Repo');
  const c = new Container();
  c.register(DB, () => ({ query: sql => `[${sql}]` }))
   .register(Repo, (ctr) => { const db = ctr.resolve(DB); return { find: id => db.query(`SELECT * WHERE id=${id}`) }; });
  console.log('DI resolve:', c.resolve(Repo).find(42));
}

module.exports = { Ok, Err, ok, err, createOrderStateMachine, createBrand, createEmail, createPositiveInt, createTypedEventEmitter, UserBuilder, memoize, Container };
