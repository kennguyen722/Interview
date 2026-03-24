'use strict';

function groupBy(items, keySelector) {
  return items.reduce((acc, item) => {
    const key = String(keySelector(item));
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepClone(value) {
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  if (isPlainObject(value)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepClone(v);
    }
    return out;
  }
  return value;
}

function flattenArray(input) {
  const result = [];
  const stack = [...input].reverse();

  while (stack.length) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      for (let i = current.length - 1; i >= 0; i -= 1) {
        stack.push(current[i]);
      }
    } else {
      result.push(current);
    }
  }

  return result;
}

function createEmitter() {
  const listeners = new Map();

  function on(event, handler) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event).add(handler);
    return () => off(event, handler);
  }

  function off(event, handler) {
    listeners.get(event)?.delete(handler);
  }

  function emit(event, payload) {
    for (const handler of listeners.get(event) ?? []) {
      handler(payload);
    }
  }

  function once(event, handler) {
    const unsubscribe = on(event, (payload) => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  return { on, off, emit, once };
}

module.exports = {
  groupBy,
  deepClone,
  flattenArray,
  createEmitter
};

if (require.main === module) {
  const grouped = groupBy(
    [
      { team: 'A', name: 'Lin' },
      { team: 'B', name: 'Rae' },
      { team: 'A', name: 'Kai' }
    ],
    (u) => u.team
  );
  console.log('groupBy keys:', Object.keys(grouped).join(','));

  const emitter = createEmitter();
  emitter.once('ready', (msg) => console.log('once:', msg));
  emitter.emit('ready', 'ok');
  emitter.emit('ready', 'ignored');
}
