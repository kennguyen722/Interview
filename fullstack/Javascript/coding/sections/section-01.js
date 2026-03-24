function myBind(fn, thisArg, ...presetArgs) {
  if (typeof fn !== 'function') throw new TypeError('myBind expects a function');
  return function boundFunction(...callArgs) {
    return fn.apply(thisArg, [...presetArgs, ...callArgs]);
  };
}

function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value.getTime());
  if (Array.isArray(value)) {
    const out = [];
    seen.set(value, out);
    for (const item of value) out.push(deepClone(item, seen));
    return out;
  }
  if (value instanceof Map) {
    const out = new Map();
    seen.set(value, out);
    for (const [k, v] of value.entries()) out.set(deepClone(k, seen), deepClone(v, seen));
    return out;
  }
  if (value instanceof Set) {
    const out = new Set();
    seen.set(value, out);
    for (const item of value.values()) out.add(deepClone(item, seen));
    return out;
  }

  const out = {};
  seen.set(value, out);
  for (const [k, v] of Object.entries(value)) out[k] = deepClone(v, seen);
  return out;
}

module.exports = { myBind, deepClone };
