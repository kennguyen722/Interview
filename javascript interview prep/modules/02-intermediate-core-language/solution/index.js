function* rangeGenerator(start, end) {
  for (let i = start; i <= end; i += 1) {
    yield i;
  }
}

function defineReadOnly(obj, key, value) {
  Object.defineProperty(obj, key, {
    value,
    writable: false,
    configurable: false,
    enumerable: true,
  });
  return obj;
}

function safeGetCity(user) {
  return user?.profile?.address?.city ?? 'unknown';
}

function weakMemoize(fn) {
  const cache = new WeakMap();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const out = fn(arg);
    cache.set(arg, out);
    return out;
  };
}

function createVisitTracker() {
  const seen = new WeakSet();
  return {
    markVisited(obj) {
      seen.add(obj);
    },
    hasVisited(obj) {
      return seen.has(obj);
    },
  };
}

function cjsVsEsmNote() {
  return {
    cjs: 'CommonJS uses require/module.exports and is loaded synchronously.',
    esm: 'ESM uses import/export and supports static analysis and top-level await.',
  };
}

const PRIVATE_META = Symbol('private-meta');
function attachPrivateMeta(obj, meta) {
  obj[PRIVATE_META] = meta;
  return obj;
}

module.exports = {
  rangeGenerator,
  defineReadOnly,
  safeGetCity,
  weakMemoize,
  createVisitTracker,
  cjsVsEsmNote,
  attachPrivateMeta,
  PRIVATE_META,
};
