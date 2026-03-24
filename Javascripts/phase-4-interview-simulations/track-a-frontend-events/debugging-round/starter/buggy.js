'use strict';

function createView(windowLike, onResize) {
  function mount() {
    windowLike.addEventListener('resize', onResize);
  }

  function unmount() {
    // BUG: forgot to remove listener.
  }

  return { mount, unmount };
}

module.exports = { createView };
