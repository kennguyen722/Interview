function customBind(fn, ctx, ...preset) {
  return (...rest) => fn.apply(ctx, [...preset, ...rest]);
}

function deepCloneCircular(value, seen = new Map()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  const out = Array.isArray(value) ? [] : {};
  seen.set(value, out);
  for (const [k, v] of Object.entries(value)) out[k] = deepCloneCircular(v, seen);
  return out;
}

function safeDeepMerge(target, source) {
  const blocked = new Set(['__proto__', 'constructor', 'prototype']);
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (blocked.has(k)) continue;
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object') out[k] = safeDeepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}

function immutableCartUpdate(cart, item) {
  const idx = cart.findIndex((c) => c.id === item.id);
  if (idx === -1) return [...cart, item];
  return cart.map((c, i) => (i === idx ? { ...c, qty: c.qty + item.qty } : c));
}

function moduleDependencyGraph(modules) {
  return modules.reduce((acc, m) => ((acc[m.name] = m.deps || []), acc), {});
}

function dynamicRuleExecutor(rules, input) {
  return rules.reduce((state, rule) => rule(state), input);
}

function classVsFactoryRefactor(kind) {
  return kind === 'class' ? 'prototype-based instance model' : 'closure-based composition model';
}

function composeValidators(validators) {
  return (value) => {
    for (const v of validators) {
      const err = v(value);
      if (err) return err;
    }
    return null;
  };
}

function reversiblePipeline(steps, value) {
  const forward = steps.reduce((v, s) => s.forward(v), value);
  const backward = [...steps].reverse().reduce((v, s) => s.reverse(v), forward);
  return { forward, backward };
}

function objectDiff(a, b) {
  const out = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if (a[k] !== b[k]) out[k] = { from: a[k], to: b[k] };
  return out;
}

function mapPayloadToDomainEntity(payload) {
  return { id: payload.user_id, email: String(payload.email || '').toLowerCase(), active: Boolean(payload.is_active) };
}

function partialApply(fn, ...preset) {
  return (...rest) => fn(...preset, ...rest);
}

function memoizeWithResolver(fn, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return (...args) => {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const out = fn(...args);
    cache.set(key, out);
    return out;
  };
}

function parseFeatureFlags(input) {
  return input.split(',').map((x) => x.trim()).filter(Boolean).reduce((acc, k) => ((acc[k] = true), acc), {});
}

function buildCommandHandlerRegistry(pairs) {
  const map = new Map(pairs);
  return { run(name, payload) { if (!map.has(name)) throw new Error('UNKNOWN_COMMAND'); return map.get(name)(payload); } };
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
