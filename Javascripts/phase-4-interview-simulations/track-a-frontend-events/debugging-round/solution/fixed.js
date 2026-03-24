'use strict';

function createView(windowLike, onResize) {
  let mounted = false;

  function mount() {
    if (mounted) {
      return;
    }
    mounted = true;
    windowLike.addEventListener('resize', onResize);
  }

  function unmount() {
    if (!mounted) {
      return;
    }
    mounted = false;
    windowLike.removeEventListener('resize', onResize);
  }

  return { mount, unmount };
}

module.exports = { createView };
