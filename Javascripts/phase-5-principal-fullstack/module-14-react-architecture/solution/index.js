'use strict';
// Module 14: React Architecture & Internals — Reference Solution

// ─── 1. createElement — Virtual DOM Node ─────────────────────────────────────
function createElement(type, props, ...children) {
  const flatChildren = children
    .flat()
    .map(child =>
      child == null || typeof child === 'boolean'
        ? null
        : typeof child === 'string' || typeof child === 'number'
          ? { type: '#text', props: { nodeValue: String(child) } }
          : child
    )
    .filter(Boolean);

  return {
    type,
    props: {
      ...(props || {}),
      children: flatChildren
    }
  };
}

// ─── 2. Reconciler: diff and patch plan ──────────────────────────────────────
function diff(oldNode, newNode, path = '') {
  const patches = [];

  if (!oldNode && newNode) {
    patches.push({ type: 'MOUNT', path, node: newNode });
    return patches;
  }
  if (oldNode && !newNode) {
    patches.push({ type: 'UNMOUNT', path });
    return patches;
  }
  if (!oldNode && !newNode) return patches;

  // Different element types → full replace
  if (oldNode.type !== newNode.type) {
    patches.push({ type: 'REPLACE', path, oldNode, newNode });
    return patches;
  }

  // Text nodes: compare values
  if (newNode.type === '#text') {
    if (oldNode.props.nodeValue !== newNode.props.nodeValue)
      patches.push({ type: 'UPDATE_TEXT', path, value: newNode.props.nodeValue });
    return patches;
  }

  // Same type: diff props
  const oldProps = oldNode.props || {};
  const newProps = newNode.props || {};
  const propChanges = {};
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)].filter(k => k !== 'children'));

  for (const key of allKeys) {
    if (oldProps[key] !== newProps[key]) propChanges[key] = { from: oldProps[key], to: newProps[key] };
  }
  if (Object.keys(propChanges).length > 0)
    patches.push({ type: 'UPDATE_PROPS', path, changes: propChanges });

  // Diff children by key or index
  const oldChildren = (oldProps.children || []);
  const newChildren = (newProps.children || []);
  const maxLen = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLen; i++) {
    patches.push(...diff(oldChildren[i], newChildren[i], `${path}[${i}]`));
  }

  return patches;
}

// ─── 3. useState hook (isolated fiber-local state) ───────────────────────────
function createFiber() {
  const slots = [];
  let cursor = 0;
  let dirty = false;

  function useStateInFiber(initial) {
    const index = cursor++;
    if (slots[index] === undefined) slots[index] = initial;

    const setState = (val) => {
      slots[index] = typeof val === 'function' ? val(slots[index]) : val;
      dirty = true;
      return slots[index];
    };

    return [slots[index], setState];
  }

  function resetCursor() { cursor = 0; }
  function isDirty() { return dirty; }
  function markClean() { dirty = false; }

  return { useStateInFiber, resetCursor, isDirty, markClean, _slots: slots };
}

// ─── 4. useMemo / useCallback equivalents ────────────────────────────────────
function createMemo(fn, deps) {
  let cachedValue;
  let cachedDeps = null;

  return {
    get() {
      const depsChanged = cachedDeps === null ||
        deps.some((dep, i) => dep !== cachedDeps[i]);
      if (depsChanged) {
        cachedValue = fn();
        cachedDeps = [...deps];
      }
      return cachedValue;
    },
    invalidate() { cachedDeps = null; }
  };
}

function createCallback(fn, deps) {
  // Same as createMemo but wraps the function reference
  let cachedFn = null;
  let cachedDeps = null;

  return {
    get() {
      const depsChanged = cachedDeps === null ||
        deps.some((dep, i) => dep !== cachedDeps[i]);
      if (depsChanged) {
        cachedFn = fn;
        cachedDeps = [...deps];
      }
      return cachedFn;
    },
    invalidate() { cachedDeps = null; }
  };
}

// ─── 5. useEffect scheduler ──────────────────────────────────────────────────
function createEffectScheduler() {
  let pendingEffect = null;
  let cleanup = null;
  let lastDeps = null;
  let scheduled = false;

  function scheduleEffect(effect, deps) {
    pendingEffect = effect;

    const depsChanged = lastDeps === null ||
      (deps && deps.some((dep, i) => dep !== lastDeps[i]));

    if (!depsChanged) return;

    if (!scheduled) {
      scheduled = true;
      // Simulate scheduling after current task (like after paint)
      Promise.resolve().then(() => {
        scheduled = false;
        if (pendingEffect) {
          if (cleanup) { cleanup(); cleanup = null; }
          cleanup = pendingEffect() || null;
          lastDeps = deps ? [...deps] : null;
          pendingEffect = null;
        }
      });
    }
  }

  function flush() {
    if (pendingEffect) {
      if (cleanup) { cleanup(); cleanup = null; }
      cleanup = pendingEffect() || null;
      lastDeps = null;
      pendingEffect = null;
      scheduled = false;
    }
  }

  function dispose() {
    if (cleanup) { cleanup(); cleanup = null; }
  }

  return { scheduleEffect, flush, dispose };
}

// ─── 6. Component Composition: Render Props + HOC ────────────────────────────
function createDataFetcher(fetchFn) {
  const state = { loading: false, data: null, error: null };

  async function render(renderCallback) {
    state.loading = true;
    state.data = null;
    state.error = null;

    try {
      state.data = await fetchFn();
      state.loading = false;
    } catch (e) {
      state.error = e;
      state.loading = false;
    }

    return renderCallback({ ...state });
  }

  return { render };
}

function withLogger(component) {
  const renderHistory = [];
  return {
    render(props) {
      renderHistory.push({ timestamp: Date.now(), props });
      return component.render(props);
    },
    getRenderHistory: () => [...renderHistory]
  };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  // Virtual DOM
  const vdom = createElement('div', { id: 'app' },
    createElement('h1', null, 'Hello'),
    createElement('p', { className: 'text' }, 'World')
  );
  console.log('VDOM type:', vdom.type, '| children:', vdom.props.children.length);

  // Diff
  const v1 = createElement('div', { class: 'old' }, 'text');
  const v2 = createElement('div', { class: 'new' }, 'changed text');
  const patches = diff(v1, v2);
  console.log('Patches:', patches.map(p => p.type));

  // Fiber state
  const fiber = createFiber();
  fiber.resetCursor();
  let [count, setCount] = fiber.useStateInFiber(0);
  fiber.resetCursor();
  [count] = fiber.useStateInFiber(0);
  setCount(5);
  console.log('Fiber dirty:', fiber.isDirty(), '| slot value:', fiber._slots[0]);

  // Memo
  let recomputations = 0;
  let reactiveVal = 10;
  const memo = createMemo(() => { recomputations++; return reactiveVal * 2; }, [reactiveVal]);
  memo.get(); memo.get(); memo.get();
  console.log(`Memo recomputations: ${recomputations} (expected 1)`);

  // DataFetcher
  const fetcher = createDataFetcher(async () => ({ id: 1, name: 'Alice' }));
  fetcher.render(({ data, loading }) => {
    if (!loading) console.log('Fetched data:', data?.name);
  });

  // HOC
  const btn = { render: ({ label }) => `<button>${label}</button>` };
  const loggedBtn = withLogger(btn);
  loggedBtn.render({ label: 'Click me' });
  console.log('Render history count:', loggedBtn.getRenderHistory().length);
}

module.exports = { createElement, diff, createFiber, createMemo, createCallback, createEffectScheduler, createDataFetcher, withLogger };
