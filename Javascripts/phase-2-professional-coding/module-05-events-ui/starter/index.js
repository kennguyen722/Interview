'use strict';

function debounce(fn, waitMs) {
  // TODO
  throw new Error('Not implemented');
}

function throttle(fn, waitMs) {
  // TODO
  throw new Error('Not implemented');
}

function createShortcutManager() {
  // TODO: register combo -> handler; support unregister and dispose.
  throw new Error('Not implemented');
}

module.exports = {
  debounce,
  throttle,
  createShortcutManager
};

if (require.main === module) {
  console.log('Module 05 starter loaded. Complete TODOs in this file.');
}
