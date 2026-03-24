function debounce(fn, wait) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  function wrapped(...args) {
    lastArgs = args;
    lastThis = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(lastThis, lastArgs);
    }, wait);
  }

  wrapped.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  wrapped.flush = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    fn.apply(lastThis, lastArgs);
  };

  return wrapped;
}

function getWindowRange(scrollTop, viewportHeight, rowHeight, total, overscan = 5) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total - 1, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
  return { start, end };
}

module.exports = { debounce, getWindowRange };
