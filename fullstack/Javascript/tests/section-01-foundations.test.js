const test = require('node:test');
const assert = require('node:assert/strict');

function myBind(fn, thisArg, ...presetArgs) {
  if (typeof fn !== 'function') {
    throw new TypeError('myBind expects a function');
  }

  return function boundFunction(...callArgs) {
    return fn.apply(thisArg, [...presetArgs, ...callArgs]);
  };
}

function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof Map) {
    const mapClone = new Map();
    seen.set(value, mapClone);
    for (const [k, v] of value.entries()) {
      mapClone.set(deepClone(k, seen), deepClone(v, seen));
    }
    return mapClone;
  }

  if (value instanceof Set) {
    const setClone = new Set();
    seen.set(value, setClone);
    for (const item of value.values()) {
      setClone.add(deepClone(item, seen));
    }
    return setClone;
  }

  if (Array.isArray(value)) {
    const arrClone = [];
    seen.set(value, arrClone);
    for (const item of value) {
      arrClone.push(deepClone(item, seen));
    }
    return arrClone;
  }

  const objClone = {};
  seen.set(value, objClone);
  for (const [k, v] of Object.entries(value)) {
    objClone[k] = deepClone(v, seen);
  }
  return objClone;
}

const BLOCKED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function isPlainObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

function safeDeepMerge(target, source) {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    throw new TypeError('target and source must be plain objects');
  }

  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.has(key)) {
      continue;
    }

    const srcVal = source[key];
    const tgtVal = target[key];

    if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      safeDeepMerge(tgtVal, srcVal);
    } else if (isPlainObject(srcVal)) {
      target[key] = safeDeepMerge({}, srcVal);
    } else {
      target[key] = srcVal;
    }
  }

  return target;
}

test('myBind binds context and preset args', () => {
  const ctx = { x: 10 };
  function add(a, b) {
    return this.x + a + b;
  }

  const bound = myBind(add, ctx, 2);
  assert.equal(bound(3), 15);
});

test('myBind throws for non-function', () => {
  assert.throws(() => myBind(123, {}), /expects a function/);
});

test('deepClone handles circular refs and built-ins', () => {
  const original = {
    now: new Date('2020-01-01T00:00:00Z'),
    map: new Map([[{ id: 1 }, new Set([1, 2])]]),
    list: [1, 2, { a: 3 }],
  };
  original.self = original;

  const cloned = deepClone(original);

  assert.notEqual(cloned, original);
  assert.equal(cloned.self, cloned);
  assert.ok(cloned.now instanceof Date);
  assert.equal(cloned.now.getTime(), original.now.getTime());
  assert.ok(cloned.map instanceof Map);
  assert.ok(cloned.list[2] !== original.list[2]);
});

test('safeDeepMerge merges nested objects', () => {
  const out = safeDeepMerge({ a: { b: 1 } }, { a: { c: 2 }, d: 3 });
  assert.deepEqual(out, { a: { b: 1, c: 2 }, d: 3 });
});

test('safeDeepMerge blocks prototype pollution', () => {
  const payload = JSON.parse('{"__proto__":{"pwned":true}}');
  const out = safeDeepMerge({}, payload);
  assert.deepEqual(out, {});
  assert.equal(({}).pwned, undefined);
});
