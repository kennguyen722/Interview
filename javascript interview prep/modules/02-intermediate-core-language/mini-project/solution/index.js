const META = Symbol('plugin-meta');

function* runPlugins(plugins, context) {
  const seen = new WeakSet();
  for (const plugin of plugins) {
    if (seen.has(plugin)) continue;
    seen.add(plugin);
    const patch = plugin?.run?.(context) ?? {};
    context = { ...context, ...patch };
    plugin[META] = { executedAt: Date.now() };
    yield { name: plugin.name ?? 'anonymous', context };
  }
}

function createLockedConfig(base) {
  const out = { ...base };
  for (const key of Object.keys(out)) {
    Object.defineProperty(out, key, {
      value: out[key],
      writable: false,
      configurable: false,
      enumerable: true,
    });
  }
  return out;
}

function createWeakObjectMemo(fn) {
  const cache = new WeakMap();
  return (obj) => {
    if (cache.has(obj)) return cache.get(obj);
    const value = fn(obj);
    cache.set(obj, value);
    return value;
  };
}

function projectUserSummary(user) {
  return {
    id: user?.id ?? 'unknown',
    email: user?.profile?.email ?? 'n/a',
    city: user?.profile?.address?.city ?? 'unknown',
  };
}

function moduleSystemBrief() {
  return {
    commonjs: 'CommonJS uses require/module.exports and runtime loading.',
    esm: 'ESM uses import/export, static graph analysis, and top-level await support.',
  };
}

module.exports = {
  runPlugins,
  createLockedConfig,
  createWeakObjectMemo,
  projectUserSummary,
  moduleSystemBrief,
  META,
};
