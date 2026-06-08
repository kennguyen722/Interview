// customBind: Returns a new function with a bound context and optional preset arguments.
// Similar to Function.prototype.bind, but supports preset and call-time arguments.
function customBind(fn, ctx, ...preset) {
  return (...rest) => fn.apply(ctx, [...preset, ...rest]);
}

// deepCloneCircular: Deeply clones an object or array, handling circular references using a Map.
function deepCloneCircular(value, seen = new Map()) {
  if (value === null || typeof value !== 'object') return value; // Primitives
  if (seen.has(value)) return seen.get(value); // Handle circular refs
  const out = Array.isArray(value) ? [] : {};
  seen.set(value, out);
  for (const [k, v] of Object.entries(value)) out[k] = deepCloneCircular(v, seen);
  return out;
}

// safeDeepMerge: Recursively merges two objects, blocking prototype pollution keys.
function safeDeepMerge(target, source) {
  const blocked = new Set(['__proto__', 'constructor', 'prototype']);
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (blocked.has(k)) continue; // Prevent prototype pollution
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object') out[k] = safeDeepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}

// immutableCartUpdate: Returns a new cart array with the item added or updated (by id), preserving immutability.
function immutableCartUpdate(cart, item) {
  const idx = cart.findIndex((c) => c.id === item.id);
  if (idx === -1) return [...cart, item]; // Add new item
  return cart.map((c, i) => (i === idx ? { ...c, qty: c.qty + item.qty } : c)); // Update qty
}

// moduleDependencyGraph: Builds a dependency graph object from an array of modules with name and deps.
function moduleDependencyGraph(modules) {
  return modules.reduce((acc, m) => ((acc[m.name] = m.deps || []), acc), {});
}

// dynamicRuleExecutor: Applies an array of rule functions to an input, chaining the result.
function dynamicRuleExecutor(rules, input) {
  return rules.reduce((state, rule) => rule(state), input);
}

// classVsFactoryRefactor: Returns a string describing the difference between class and factory patterns.
function classVsFactoryRefactor(kind) {
  return kind === 'class' ? 'prototype-based instance model' : 'closure-based composition model';
}

// composeValidators: Composes multiple validator functions into one, returning the first error or null.
function composeValidators(validators) {
  return (value) => {
    for (const v of validators) {
      const err = v(value);
      if (err) return err; // Return on first error
    }
    return null; // All valid
  };
}

// reversiblePipeline: Applies a series of forward and reverse transformations to a value.
// Returns both the forward and backward result.
function reversiblePipeline(steps, value) {
  const forward = steps.reduce((v, s) => s.forward(v), value);
  const backward = [...steps].reverse().reduce((v, s) => s.reverse(v), forward);
  return { forward, backward };
}

// objectDiff: Returns an object describing the differences between two objects (a and b).
function objectDiff(a, b) {
  const out = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if (a[k] !== b[k]) out[k] = { from: a[k], to: b[k] };
  return out;
}

// mapPayloadToDomainEntity: Maps a raw payload object to a normalized domain entity object.
function mapPayloadToDomainEntity(payload) {
  return { id: payload.user_id, email: String(payload.email || '').toLowerCase(), active: Boolean(payload.is_active) };
}

// partialApply: Returns a new function with preset arguments applied to the original function.
function partialApply(fn, ...preset) {
  return (...rest) => fn(...preset, ...rest);
}

// memoizeWithResolver: Memoizes a function with a custom resolver for cache keys.
function memoizeWithResolver(fn, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return (...args) => {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key); // Return cached result
    const out = fn(...args);
    cache.set(key, out); // Cache result
    return out;
  };
}

// parseFeatureFlags: Parses a comma-separated string into an object of feature flags (all true).
function parseFeatureFlags(input) {
  return input.split(',').map((x) => x.trim()).filter(Boolean).reduce((acc, k) => ((acc[k] = true), acc), {});
}

// buildCommandHandlerRegistry: Builds a registry of command handlers from pairs, with a run method.
function buildCommandHandlerRegistry(pairs) {
  const map = new Map(pairs);
  return {
    run(name, payload) {
      if (!map.has(name)) throw new Error('UNKNOWN_COMMAND');
      return map.get(name)(payload);
    }
  };
}

module.exports = {
  customBind,
  deepCloneCircular,
  safeDeepMerge,
  immutableCartUpdate,
  moduleDependencyGraph,
  dynamicRuleExecutor,
  classVsFactoryRefactor,
  composeValidators,
  reversiblePipeline,
  objectDiff,
  mapPayloadToDomainEntity,
  partialApply,
  memoizeWithResolver,
  parseFeatureFlags,
  buildCommandHandlerRegistry,
};
