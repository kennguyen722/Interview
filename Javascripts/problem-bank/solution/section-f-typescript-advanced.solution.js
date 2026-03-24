'use strict';
// Problem Bank Section F: TypeScript & Advanced Design Patterns
// Problems 41–48 — Complete Solutions

// ─── Problem 41: Type-Safe Event Emitter ─────────────────────────────────────
function createTypedEventEmitter() {
  const listeners = new Map();

  function on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => listeners.get(event)?.delete(handler);
  }

  function once(event, handler) {
    const unsub = on(event, function wrapper(payload) {
      handler(payload);
      unsub();
    });
    return unsub;
  }

  function off(event, handler) {
    listeners.get(event)?.delete(handler);
  }

  function emit(event, payload) {
    listeners.get(event)?.forEach(h => h(payload));
  }

  return { on, once, off, emit };
}

// ─── Problem 42: Result<T,E> Monad ───────────────────────────────────────────
class Ok {
  constructor(value) {
    this.type = 'ok';
    this.value = value;
  }
  map(fn)        { return new Ok(fn(this.value)); }
  flatMap(fn)    { return fn(this.value); }
  mapError(_fn)  { return this; }
  unwrap()       { return this.value; }
  unwrapOr(_d)   { return this.value; }
  isOk()         { return true; }
  isErr()        { return false; }
}

class Err {
  constructor(error) {
    this.type = 'err';
    this.error = error;
  }
  map(_fn)       { return this; }
  flatMap(_fn)   { return this; }
  mapError(fn)   { return new Err(fn(this.error)); }
  unwrap()       { throw this.error; }
  unwrapOr(d)    { return d; }
  isOk()         { return false; }
  isErr()        { return true; }
}

const ok  = v => new Ok(v);
const err = e => new Err(e);

// ─── Problem 43: Generic LRU Cache with TTL and Max Size ─────────────────────
// Implementation: doubly-linked list + Map for O(1) get/set/evict
function createLRUCache({ maxSize = 100, ttlMs = Infinity } = {}) {
  // Nodes: { key, value, expiry, prev, next }
  const map = new Map();
  // Sentinel head (oldest) and tail (newest)
  const head = { key: null, prev: null, next: null };
  const tail = { key: null, prev: null, next: null };
  head.next = tail;
  tail.prev = head;

  function detach(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  function insertBefore(node, ref) {
    node.next = ref;
    node.prev = ref.prev;
    ref.prev.next = node;
    ref.prev = node;
  }

  function promote(node) {
    detach(node);
    insertBefore(node, tail); // most-recently used = right before tail
  }

  function get(key) {
    const node = map.get(key);
    if (!node) return undefined;
    if (node.expiry !== Infinity && Date.now() > node.expiry) {
      detach(node);
      map.delete(key);
      return undefined;
    }
    promote(node);
    return node.value;
  }

  function set(key, value) {
    if (map.has(key)) {
      const node = map.get(key);
      node.value = value;
      node.expiry = ttlMs === Infinity ? Infinity : Date.now() + ttlMs;
      promote(node);
      return;
    }
    // Evict LRU if at capacity
    if (map.size >= maxSize) {
      const lru = head.next; // oldest
      detach(lru);
      map.delete(lru.key);
    }
    const node = {
      key, value,
      expiry: ttlMs === Infinity ? Infinity : Date.now() + ttlMs,
      prev: null, next: null
    };
    insertBefore(node, tail);
    map.set(key, node);
  }

  function del(key) {
    const node = map.get(key);
    if (!node) return false;
    detach(node);
    map.delete(key);
    return true;
  }

  function size() { return map.size; }
  function clear() {
    map.clear();
    head.next = tail;
    tail.prev = head;
  }

  return { get, set, delete: del, size, clear };
}

// ─── Problem 44: Type-Safe Dependency Injection Container ─────────────────────
class Container {
  #registry = new Map();
  #singletons = new Map();

  register(token, factory, { singleton = true } = {}) {
    this.#registry.set(token, { factory, singleton });
    return this; // fluent
  }

  resolve(token) {
    const entry = this.#registry.get(token);
    if (!entry) throw new Error(`Token not registered: ${String(token)}`);
    if (entry.singleton) {
      if (!this.#singletons.has(token)) {
        this.#singletons.set(token, entry.factory(this));
      }
      return this.#singletons.get(token);
    }
    return entry.factory(this);
  }

  reset() { this.#singletons.clear(); }
}

// ─── Problem 45: Discriminated Union State Machine ────────────────────────────
function createStateMachine({ initial, transitions }) {
  let current = initial;
  const guards = new Map(); // `from->to` key → predicate fn

  function transition(to, context = {}) {
    const allowed = transitions[current] || [];
    if (!allowed.includes(to)) {
      return err(new Error(`Illegal transition: ${current} → ${to}`));
    }
    const guardKey = `${current}->${to}`;
    const guard = guards.get(guardKey);
    if (guard && !guard(context)) {
      return err(new Error(`Guard rejected transition: ${current} → ${to}`));
    }
    const from = current;
    current = to;
    return ok({ from, to: current });
  }

  function addGuard(from, to, predicate) {
    guards.set(`${from}->${to}`, predicate);
    return machineApi;
  }

  function getState() { return current; }
  function can(to) { return (transitions[current] || []).includes(to); }

  const machineApi = { transition, addGuard, getState, can };
  return machineApi;
}

// ─── Problem 46: Schema Validator ─────────────────────────────────────────────
function createSchema(definition) {
  function validate(data) {
    const errors = [];

    for (const [field, rules] of Object.entries(definition)) {
      const value = data[field];
      const missing = value === undefined || value === null || value === '';

      if (rules.required && missing) {
        errors.push(`${field}: required`);
        continue;
      }
      if (missing) continue;

      // Type check
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (rules.type && actualType !== rules.type) {
        errors.push(`${field}: expected ${rules.type}, got ${actualType}`);
        continue;
      }

      // min / max for numbers and string length
      if (rules.min !== undefined) {
        const size = rules.type === 'string' ? value.length : value;
        if (size < rules.min) errors.push(`${field}: min is ${rules.min}`);
      }
      if (rules.max !== undefined) {
        const size = rules.type === 'string' ? value.length : value;
        if (size > rules.max) errors.push(`${field}: max is ${rules.max}`);
      }

      // Pattern (strings only)
      if (rules.pattern && rules.type === 'string') {
        const re = rules.pattern instanceof RegExp ? rules.pattern : new RegExp(rules.pattern);
        if (!re.test(value)) errors.push(`${field}: does not match pattern`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  return { validate };
}

// ─── Problem 47: Generic Observable / Reactive Stream ─────────────────────────
function createObservable(subscribeFn) {
  function subscribe(observer) {
    const { next = () => {}, error = () => {}, complete = () => {} } = observer;
    let active = true;
    function unsubscribe() { active = false; }

    subscribeFn({
      next(v)    { if (active) next(v); },
      error(e)   { if (active) { active = false; error(e); } },
      complete() { if (active) { active = false; complete(); } }
    }, unsubscribe);

    return { unsubscribe };
  }

  function map(fn) {
    return createObservable((sink) => {
      subscribe({
        next(v)    { sink.next(fn(v)); },
        error(e)   { sink.error(e); },
        complete() { sink.complete(); }
      });
    });
  }

  function filter(pred) {
    return createObservable((sink) => {
      subscribe({
        next(v)    { if (pred(v)) sink.next(v); },
        error(e)   { sink.error(e); },
        complete() { sink.complete(); }
      });
    });
  }

  function take(n) {
    return createObservable((sink, unsub) => {
      let count = 0;
      const sub = subscribe({
        next(v) {
          if (count < n) {
            sink.next(v);
            count++;
            if (count === n) { sink.complete(); sub?.unsubscribe(); }
          }
        },
        error(e)   { sink.error(e); },
        complete() { sink.complete(); }
      });
    });
  }

  return { subscribe, map, filter, take };
}

// ─── Problem 48: Type-Safe Command Bus ────────────────────────────────────────
function createCommandBus() {
  const handlers = new Map();

  function register(commandType, handler) {
    if (handlers.has(commandType)) {
      throw new Error(`Handler already registered for: ${commandType}`);
    }
    handlers.set(commandType, handler);
    return () => handlers.delete(commandType); // returns unregister fn
  }

  async function execute(command) {
    const handler = handlers.get(command.type);
    if (!handler) throw new Error(`No handler registered for command: ${command.type}`);
    return handler(command.payload, command);
  }

  function has(commandType) { return handlers.has(commandType); }

  return { register, execute, has };
}

// ─── Demo ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  // P41: Event Emitter
  const emitter = createTypedEventEmitter();
  const unsub = emitter.on('login', ({ userId }) => console.log('Login:', userId));
  emitter.emit('login', { userId: 'u-1' });
  unsub();
  emitter.emit('login', { userId: 'u-2' }); // silent after unsub

  // P42: Result monad
  const result = ok(10)
    .map(n => n * 5)
    .flatMap(n => n > 40 ? ok(n) : err(new Error('too small')))
    .mapError(e => new Error(`Wrapped: ${e.message}`));
  console.log('Result:', result.isOk() ? result.value : result.error.message);

  // P43: LRU Cache
  const cache = createLRUCache({ maxSize: 3 });
  cache.set('a', 1); cache.set('b', 2); cache.set('c', 3);
  cache.get('a');            // promote 'a'
  cache.set('d', 4);         // evicts 'b' (LRU)
  console.log('LRU b:', cache.get('b')); // undefined
  console.log('LRU a:', cache.get('a')); // 1

  // P44: DI Container
  const container = new Container();
  const LOG = Symbol('LOG');
  container.register(LOG, () => ({ info: msg => console.log('[LOG]', msg) }));
  container.resolve(LOG).info('DI works');

  // P45: State Machine
  const sm = createStateMachine({
    initial: 'idle',
    transitions: { idle: ['running'], running: ['paused', 'done'], paused: ['running', 'done'] }
  });
  sm.transition('running');
  sm.transition('paused');
  const bad = sm.transition('idle');
  console.log('SM bad:', bad.isErr() ? bad.error.message : 'ok');

  // P46: Schema Validator
  const schema = createSchema({
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age:   { type: 'number', required: true, min: 0, max: 120 }
  });
  console.log('Schema:', schema.validate({ email: 'bad', age: 25 }));

  // P47: Observable
  const obs = createObservable((sink) => {
    [1, 2, 3, 4, 5].forEach(v => sink.next(v));
    sink.complete();
  });
  const results = [];
  obs.filter(n => n % 2 === 0).map(n => n * 10).subscribe({ next: v => results.push(v), complete: () => console.log('Observable:', results) });

  // P48: Command Bus
  const bus = createCommandBus();
  bus.register('CREATE_USER', async ({ name }) => ({ id: 'u-1', name }));
  bus.execute({ type: 'CREATE_USER', payload: { name: 'Alice' } }).then(r => console.log('Bus result:', r));
}

module.exports = { createTypedEventEmitter, Ok, Err, ok, err, createLRUCache, Container, createStateMachine, createSchema, createObservable, createCommandBus };
