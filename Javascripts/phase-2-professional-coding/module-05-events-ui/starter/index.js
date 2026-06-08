'use strict';

/**
 * Returns a debounced version of the provided function that delays invoking
 * `fn` until after `waitMs` milliseconds have elapsed since the last time
 * the debounced function was called.
 * This ensures that `fn` is not called too frequently, and only executes after
 * the caller has stopped invoking the debounced function for at least `waitMs`
 * milliseconds.
 * In other words, the debounced function will only call `fn` after the caller
 * has stopped calling it for `waitMs` milliseconds, preventing rapid repeated
 * invocations of `fn`.
 *
 * This is useful for scenarios like handling user input events (e.g., keypress,
 * scroll, resize) where you want to limit how often a function is called in
 * response to rapid events, and only want to execute the function once the
 * events have "settled" for a certain period of time.
 *
 */
function debounce(fn, waitMs) {
  // TODO
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), waitMs);
  };

  //throw new Error('Not implemented');
}


/**
 * Returns a throttled version of the provided function that ensures `fn` is
 * invoked at most once every `waitMs` milliseconds, regardless of how many
 * times the throttled function is called during that interval.
 * This is useful for scenarios where you want to limit the rate at which a
 * function can be executed, such as handling scroll or resize events where
 * you want to ensure the handler is not called more frequently than a
 * specified interval.
 * In other words, the throttled function will call `fn` immediately on the first
 * invocation, and then ignore subsequent calls until `waitMs` milliseconds have
 * passed since the last time `fn` was invoked, ensuring that `fn` is not called
 * more frequently than once per `waitMs` interval.
 *
 */
function throttle(fn, waitMs) {
  // TODO
  let lastCallTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCallTime >= waitMs) {
      lastCallTime = now;
      fn.apply(this, args);
    }
  };

  //throw new Error('Not implemented');
}

/**
 * Creates and returns a shortcut manager that allows registering keyboard shortcut
 * combinations to handler functions, unregistering them, and disposing of all
 * registered shortcuts. The shortcut manager should maintain a mapping of
 * key combinations to handler functions and provide methods to add, remove, and
 * clean up these shortcuts in a way that can be used to manage keyboard event
 * listeners efficiently.
 * The returned shortcut manager should expose methods to:
 *   - register a shortcut combination with a handler function
 *   - unregister a previously registered shortcut
 *   - dispose of all registered shortcuts and clean up any event listeners
 * This allows for centralized management of keyboard shortcuts in a way that
 * avoids adding multiple global event listeners for each individual shortcut
 * and ensures that shortcuts can be cleanly removed when no longer needed.
 *
 */
function createShortcutManager() {
  // TODO: register combo -> handler; support unregister and dispose.
  const shortcuts = new Map();
  function handleKeydown(event) {
    const combo = [];
    if (event.ctrlKey) combo.push('Control');
    if (event.altKey) combo.push('Alt');
    if (event.shiftKey) combo.push('Shift');
    if (event.metaKey) combo.push('Meta');
    combo.push(event.key);
    const comboStr = combo.join('+');
    const handler = shortcuts.get(comboStr);
    if (handler) {
      handler(event);
    }
  }

  document.addEventListener('keydown', handleKeydown);
  return {
    register(comboStr, handler) {
      shortcuts.set(comboStr, handler);
    },
    unregister(comboStr) {
      shortcuts.delete(comboStr);
    },
    dispose() {
      shortcuts.clear();
      document.removeEventListener('keydown', handleKeydown);
    }
  };

  //throw new Error('Not implemented');
}

module.exports = {
  debounce,
  throttle,
  createShortcutManager
};

if (require.main === module) {
  console.log('Module 05 starter loaded. Complete TODOs in this file.');
  console.log('Test debounce and throttle functions here if desired.');
  const debounced = debounce(() => console.log('Debounced!'), 500);
  const throttled = throttle(() => console.log('Throttled!'), 500);
  // Simulate rapid calls to test debounce
  let count = 0;
  const intervalId = setInterval(() => {
    debounced();
    throttled();
    count++;
    if (count >= 10) {
      clearInterval(intervalId);
      console.log('Finished testing debounce and throttle.');
    }
  }, 100);

  // Test shortcut manager
  const shortcutManager = createShortcutManager();
  shortcutManager.register('Control+Shift+X', (e) => {
    console.log('Shortcut Control+Shift+X triggered!');
  });
  // To test, press Control+Shift+X in the browser while this script is running
  // You can also test unregistering the shortcut by calling:
  // shortcutManager.unregister('Control+Shift+X');
  // and then pressing the same key combination to verify that the handler no longer fires.
  // Finally, you can test dispose by calling:
  // shortcutManager.dispose();
  // which should remove all registered shortcuts and the keydown listener.


}
