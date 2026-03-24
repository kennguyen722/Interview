'use strict';

function debounce(fn, waitMs) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
}

function throttle(fn, waitMs) {
  let lastRun = 0;
  let trailingTimer = null;

  return (...args) => {
    const now = Date.now();
    const remaining = waitMs - (now - lastRun);

    if (remaining <= 0) {
      lastRun = now;
      fn(...args);
      return;
    }

    clearTimeout(trailingTimer);
    trailingTimer = setTimeout(() => {
      lastRun = Date.now();
      fn(...args);
    }, remaining);
  };
}

function normalizeEventCombo(event) {
  const parts = [];
  if (event.ctrlKey) {
    parts.push('ctrl');
  }
  if (event.shiftKey) {
    parts.push('shift');
  }
  if (event.altKey) {
    parts.push('alt');
  }
  parts.push(String(event.key).toLowerCase());
  return parts.join('+');
}

function createShortcutManager() {
  const handlers = new Map();

  function register(combo, handler) {
    handlers.set(combo.toLowerCase(), handler);
    return () => handlers.delete(combo.toLowerCase());
  }

  function handleKeydown(event) {
    const key = normalizeEventCombo(event);
    const handler = handlers.get(key);
    if (handler) {
      handler(event);
    }
  }

  function dispose() {
    handlers.clear();
  }

  return {
    register,
    handleKeydown,
    dispose
  };
}

module.exports = {
  debounce,
  throttle,
  createShortcutManager
};

if (require.main === module) {
  const manager = createShortcutManager();
  manager.register('ctrl+k', () => console.log('Shortcut triggered'));
  manager.handleKeydown({ ctrlKey: true, shiftKey: false, altKey: false, key: 'k' });
}
