
/*
 * 1. rangeGenerator - generates a sequence of numbers from start to end
 *    inclusive, yielding each number in turn.
 */

// rangeGenerator: Generates a sequence of numbers from start to end (inclusive) using a generator.
// Usage: for (let n of rangeGenerator(1, 5)) { ... }
function* rangeGenerator(start, end) {
  for (let i = start; i <= end; i += 1) {
    yield i; // Yield each number in the range
  }
}

/*
 * 2. defineReadOnly - defines a property on an object that cannot be
 *    overwritten or reconfigured, effectively making it read-only.
 */

// defineReadOnly: Defines a read-only property on an object.
// The property cannot be changed or reconfigured.
function defineReadOnly(obj, key, value) {
  Object.defineProperty(obj, key, {
    value, // The value to set
    writable: false, // Not writable
    configurable: false, // Not reconfigurable
    enumerable: true, // Shows up in enumeration
  });
  return obj;
}

/*
 * 3. safeGetCity - safely retrieves the city from a nested user object,
 *    returning 'unknown' if any part of the path is undefined.
 */

// safeGetCity: Safely retrieves the city from a nested user object.
// Returns 'unknown' if any property in the chain is missing.
function safeGetCity(user) {
  return user?.profile?.address?.city ?? 'unknown';
}

/*
 * 4. weakMemoize - memoizes a function whose argument is an object, using a
 *    WeakMap to cache results keyed by the object, allowing garbage collection
 *    of keys when they are no longer referenced elsewhere.
 */


// weakMemoize: Memoizes a function whose argument is an object, using WeakMap for caching.
// This allows garbage collection of keys when no longer referenced elsewhere.
function weakMemoize(fn) {
  const cache = new WeakMap();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg); // Return cached result if available
    const out = fn(arg); // Compute result
    cache.set(arg, out); // Cache result
    return out;
  };
}

/*
 * 5. createVisitTracker - creates a tracker that uses a WeakSet to record
 *    objects that have been "visited", allowing the tracker to check if an
 *    object has been seen before without preventing garbage collection of
 *    the objects.
 */

// createVisitTracker: Returns an object with methods to mark and check if an object has been visited.
// Uses WeakSet so objects can be garbage collected.
function createVisitTracker() {
  const seen = new WeakSet();
  return {
    // Mark an object as visited
    markVisited(obj) {
      seen.add(obj);
    },
    // Check if an object has been visited
    hasVisited(obj) {
      return seen.has(obj);
    },
  };
}

/*
 * 6. cjsVsEsmNote - returns a note explaining the difference between CommonJS
 *    and ESM module systems in Node.js.
 */

// cjsVsEsmNote: Returns a note explaining the difference between CommonJS and ESM modules in Node.js.
function cjsVsEsmNote() {
  return {
    cjs: 'CommonJS uses require/module.exports and is loaded synchronously.',
    esm: 'ESM uses import/export and supports static analysis and top-level await.',
  };
}

/*
 * 7. attachPrivateMeta - attaches metadata to an object using a Symbol key
 *    to avoid collisions with other properties, effectively creating a
 *    "private" property that is not enumerable.
 */

// attachPrivateMeta: Attaches metadata to an object using a Symbol key for privacy.
// The property is not enumerable and avoids name collisions.
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
