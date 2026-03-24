# Section 4: Frontend Engineering Practical Interviews (Full Detail)

This section targets frontend interview rounds where coding quality, browser reasoning, and production tradeoffs matter as much as correctness.

## Problem 1: Implement Debounce with Cancel and Flush

### Problem statement
Implement `debounce(fn, wait)` returning a wrapped function with:
- delayed invocation
- `.cancel()` to drop pending invocation
- `.flush()` to execute immediately if pending

### Difficulty
Medium

### Interview expectations
- Correct timer lifecycle.
- Preserve latest args and this context.

### Clarifying questions a strong candidate should ask
- Leading vs trailing execution?
- Should flush return result?

### Brute-force approach
- Simple timer reset wrapper.

### Optimized approach
- Add cancel/flush API for production utility behavior.

### Time and space complexity
- Time O(1) per call
- Space O(1)

### Clean JavaScript solution
```javascript
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
    lastArgs = null;
    lastThis = null;
  };

  wrapped.flush = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    fn.apply(lastThis, lastArgs);
  };

  return wrapped;
}
```

### Alternative solutions when useful
- Leading+trailing configurable debounce.

### Edge cases
- Rapid consecutive calls.
- Cancel before timeout fires.

### Test cases
```javascript
// Use fake timers in test framework to validate schedule behavior deterministically.
```

### Follow-up questions
- Build throttle with trailing option.

### Real-world production relevance
- Search inputs, resize handlers, analytics event batching.

---

## Problem 2: Event Delegation for Dynamic Lists

### Problem statement
Attach one click listener to a list container and handle clicks on dynamic child buttons.

### Difficulty
Easy-Medium

### Interview expectations
- Use bubbling and closest matching.
- Avoid per-item listeners.

### Clarifying questions a strong candidate should ask
- How should nested click targets be matched?
- Need keyboard accessibility handling too?

### Brute-force approach
- Attach listeners to each list item.

### Optimized approach
- Single delegated listener on parent.

### Time and space complexity
- Time O(1) listener setup
- Space O(1) listeners

### Clean JavaScript solution
```javascript
function attachDelegatedListHandler(container, onAction) {
  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button || !container.contains(button)) return;
    onAction(button.dataset.action, button);
  });
}
```

### Alternative solutions when useful
- Delegate on document root for global interactions.

### Edge cases
- Clicks from nested SVG/icon nodes.
- Removed DOM nodes during event handling.

### Test cases
- Verify dynamically inserted child triggers handler without rebinding.

### Follow-up questions
- Extend for keyboard events and ARIA behavior.

### Real-world production relevance
- Large lists/tables with high DOM churn.

---

## Problem 3: Fix Stale Closure Bug in React Hook

### Problem statement
A component sets interval in `useEffect` but callback reads stale state. Fix it.

### Difficulty
Medium

### Interview expectations
- Identify stale closure root cause.
- Provide robust hook-level fix.

### Clarifying questions a strong candidate should ask
- Should interval recreate on state updates?
- Is callback identity stable requirement?

### Brute-force approach
- Add state to dependencies causing interval recreation each tick.

### Optimized approach
- Keep latest callback in ref and stable interval.

### Time and space complexity
- O(1)

### Clean JavaScript solution
```javascript
import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return undefined;
    const id = setInterval(() => {
      saved.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

### Alternative solutions when useful
- Use reducer/event model to avoid closure-heavy effect logic.

### Edge cases
- Delay becomes null.
- Callback throws.

### Test cases
- Simulate state updates and verify interval uses latest value.

### Follow-up questions
- Compare with `useEffectEvent` style APIs.

### Real-world production relevance
- Frequent source of bugs in dashboards and live-updating UIs.

---

## Problem 4: Virtualized List Windowing

### Problem statement
Render only visible rows for a 50k-item list.

### Difficulty
Hard

### Interview expectations
- Compute visible range from scroll position.
- Use spacer elements for full-height illusion.

### Clarifying questions a strong candidate should ask
- Fixed row height or variable height?
- Overscan size requirements?

### Brute-force approach
- Render all rows.

### Optimized approach
- Windowing + overscan.

### Time and space complexity
- Render cost O(v) where v is visible row count.

### Clean JavaScript solution
```javascript
function getWindowRange(scrollTop, viewportHeight, rowHeight, total, overscan = 5) {
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(
    total - 1,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan
  );
  return { start, end };
}
```

### Alternative solutions when useful
- Variable-size virtualization with measured row cache.

### Edge cases
- Very small list.
- Fast scroll jump.

### Test cases
- Validate start/end boundaries across random scroll positions.

### Follow-up questions
- Preserve keyboard focus when rows unmount/remount.

### Real-world production relevance
- Prevents jank and memory spikes in enterprise data grids.

---

## Problem 5: Client-Side Request Cache with Stale-While-Revalidate

### Problem statement
Implement cache wrapper returning stale data quickly and refreshing in background.

### Difficulty
Hard

### Interview expectations
- Distinguish freshness window vs stale window.
- Avoid duplicate refreshes for same key.

### Clarifying questions a strong candidate should ask
- What staleness is acceptable?
- Should stale data be served on refresh failure?

### Brute-force approach
- No cache or fixed TTL only.

### Optimized approach
- SWR policy with in-flight dedupe.

### Time and space complexity
- Lookup O(1)
- Space O(keys)

### Clean JavaScript solution
```javascript
function createSWRCache(fetcher, { ttlMs = 5000 } = {}) {
  const store = new Map();

  return async function get(key) {
    const now = Date.now();
    const entry = store.get(key);

    if (entry && now - entry.updatedAt < ttlMs) {
      return entry.value;
    }

    if (entry && entry.inFlight) {
      return entry.value;
    }

    const inFlight = fetcher(key)
      .then((value) => {
        store.set(key, { value, updatedAt: Date.now(), inFlight: null });
        return value;
      })
      .catch(() => {
        if (entry) {
          store.set(key, { ...entry, inFlight: null });
          return entry.value;
        }
        throw new Error('cache fetch failed with no stale value');
      });

    store.set(key, {
      value: entry ? entry.value : undefined,
      updatedAt: entry ? entry.updatedAt : 0,
      inFlight,
    });

    return entry ? entry.value : inFlight;
  };
}
```

### Alternative solutions when useful
- React Query/SWR libraries.

### Edge cases
- First request failure.
- Stale value absent.

### Test cases
- Verify stale immediate return and background refresh behavior.

### Follow-up questions
- Add per-key invalidation and max-size eviction.

### Real-world production relevance
- Dashboard responsiveness under flaky backend latency.

---

## Problem 6: Prevent Layout Thrashing

### Problem statement
Code interleaves DOM reads and writes in loops causing forced reflow. Refactor.

### Difficulty
Medium

### Interview expectations
- Batch reads, then writes.
- Use requestAnimationFrame for visual writes.

### Clarifying questions a strong candidate should ask
- Frequency of operation?
- Can stale measurements be tolerated one frame?

### Brute-force approach
- Read/write in same loop.

### Optimized approach
- Read phase then write phase.

### Time and space complexity
- O(n)

### Clean JavaScript solution
```javascript
function updatePositions(elements) {
  const rects = elements.map((el) => el.getBoundingClientRect());
  requestAnimationFrame(() => {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].style.transform = `translateY(${Math.round(rects[i].top)}px)`;
    }
  });
}
```

### Alternative solutions when useful
- Use CSS transitions and class toggles to minimize JS layout work.

### Edge cases
- Elements removed before RAF executes.

### Test cases
- Performance profile should show fewer forced layout events.

### Follow-up questions
- How to instrument long tasks and CLS regressions?

### Real-world production relevance
- Direct impact on interaction latency and Core Web Vitals.

---

## Problem 7: SSR Hydration Mismatch Guard

### Problem statement
Prevent hydration mismatch caused by client-only values during initial render.

### Difficulty
Medium

### Interview expectations
- Separate server-safe render from client-only enhancement.

### Clarifying questions a strong candidate should ask
- Is framework Next.js/Remix/custom SSR?
- SEO constraints?

### Brute-force approach
- Render `window`-dependent content immediately.

### Optimized approach
- Render deterministic shell; hydrate client-only fields in effect.

### Time and space complexity
- O(1)

### Clean JavaScript solution
```javascript
import { useEffect, useState } from 'react';

function ClientTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);
  return <span>{time || '...'}</span>;
}
```

### Alternative solutions when useful
- Mark non-critical region as client-only.

### Edge cases
- Locale differences between server and client.

### Test cases
- Snapshot server HTML and verify client hydration warnings absent.

### Follow-up questions
- Streaming SSR and partial hydration strategy.

### Real-world production relevance
- Reduces production hydration bugs and SEO regressions.

---

## Problem 8: Error Boundary + Frontend Observability Hook

### Problem statement
Capture UI failures with context and send structured error events.

### Difficulty
Medium-Hard

### Interview expectations
- Differentiate recoverable vs unrecoverable UI errors.
- Attach route/user/session context safely.

### Clarifying questions a strong candidate should ask
- PII redaction requirements?
- Retry UX policy?

### Brute-force approach
- console.error only.

### Optimized approach
- Error boundary + telemetry function.

### Time and space complexity
- O(1) per error event

### Clean JavaScript solution
```javascript
function reportClientError(error, context) {
  const payload = {
    message: error?.message || 'unknown',
    stack: error?.stack || '',
    route: context.route,
    traceId: context.traceId,
    ts: Date.now(),
  };
  navigator.sendBeacon('/client-errors', JSON.stringify(payload));
}
```

### Alternative solutions when useful
- Sentry/OpenTelemetry SDK integration.

### Edge cases
- sendBeacon unavailable.
- Circular context payload.

### Test cases
- Validate payload schema and PII redaction.

### Follow-up questions
- Correlate client error with backend trace ID.

### Real-world production relevance
- Essential for triaging frontend incidents quickly.

---

## Section 4 Mock Interview Drill

1. Implement debounce+throttle utilities with deterministic tests.
2. Build a minimal virtualized list with overscan.
3. Diagnose and fix a stale closure bug in provided React component.
4. Explain SSR hydration mismatch mitigation plan.

## Section 4 Exit Criteria

- You can reason about render performance, state consistency, and browser APIs.
- You write frontend utilities with production-safe interfaces.
- You can explain tradeoffs with UX and operational impact.
