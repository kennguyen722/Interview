'use strict';
// Tests for Problem Bank Section G: Full Stack Integration Patterns
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  createSSRDataCache,
  createOptimisticUpdateManager,
  createDataLoader,
  createFormState,
  createInfiniteScrollController,
  createGCounter,
  createFeatureFlagService,
  createABTestAssigner
} = require('../solution/section-g-fullstack-patterns.solution.js');

// ─── P49: SSR Data Cache ──────────────────────────────────────────────────────
describe('P49: createSSRDataCache', () => {
  it('set and get return stored data', () => {
    const cache = createSSRDataCache({ ttlMs: 5000 });
    cache.set('user', { id: 1 });
    assert.deepEqual(cache.get('user'), { id: 1 });
  });

  it('get returns undefined for expired entry', async () => {
    const cache = createSSRDataCache({ ttlMs: 30 });
    cache.set('key', 'val');
    await new Promise(r => setTimeout(r, 50));
    assert.equal(cache.get('key'), undefined);
  });

  it('generateHydrationScript() produces valid <script> with window.__SSR_DATA__', () => {
    const cache = createSSRDataCache({ ttlMs: 5000 });
    cache.set('items', [1, 2, 3]);
    const script = cache.generateHydrationScript();
    assert.ok(script.startsWith('<script>'));
    assert.ok(script.includes('window.__SSR_DATA__'));
    assert.ok(script.includes('"items"'));
  });

  it('generateHydrationScript() escapes </script> in data', () => {
    const cache = createSSRDataCache({ ttlMs: 5000 });
    cache.set('xss', '</script><script>alert(1)</script>');
    const script = cache.generateHydrationScript();
    // Strip the one legitimate closing </script> wrapper at the end
    const inner = script.replace(/<\/script>\s*$/, '');
    // No unescaped </script> should remain in the JSON content
    assert.ok(!inner.includes('</script>'), 'Unescaped </script> found in script content — XSS risk');
  });

  it('clear() removes all entries', () => {
    const cache = createSSRDataCache({ ttlMs: 5000 });
    cache.set('a', 1); cache.set('b', 2);
    cache.clear();
    assert.equal(cache.get('a'), undefined);
  });
});

// ─── P50: Optimistic Update Manager ──────────────────────────────────────────
describe('P50: createOptimisticUpdateManager', () => {
  it('applyOptimistic sets speculative state immediately', () => {
    const mgr = createOptimisticUpdateManager();
    mgr.applyOptimistic('post-1', { likes: 11 });
    assert.deepEqual(mgr.getState('post-1'), { likes: 11 });
  });

  it('rollback reverts to previous value', () => {
    const mgr = createOptimisticUpdateManager();
    mgr.applyOptimistic('post-1', { likes: 10 });
    mgr.applyOptimistic('post-1', { likes: 11 });
    mgr.rollback('post-1');
    assert.deepEqual(mgr.getState('post-1'), { likes: 10 });
  });

  it('apply() confirms on server success', async () => {
    const mgr = createOptimisticUpdateManager();
    const result = await mgr.apply('post-1', { likes: 11 }, async () => ({ likes: 11 }));
    assert.deepEqual(result, { likes: 11 });
    assert.deepEqual(mgr.getState('post-1'), { likes: 11 });
  });

  it('apply() rolls back on server failure', async () => {
    const mgr = createOptimisticUpdateManager();
    mgr.applyOptimistic('post-1', { likes: 10 }); // establish baseline
    await assert.rejects(
      () => mgr.apply('post-1', { likes: 11 }, async () => { throw new Error('Network error'); }),
      /Network error/
    );
    assert.deepEqual(mgr.getState('post-1'), { likes: 10 });
  });
});

// ─── P51: DataLoader ─────────────────────────────────────────────────────────
describe('P51: createDataLoader', () => {
  it('batches multiple load() calls from same tick', async () => {
    let batchCallCount = 0;
    const loader = createDataLoader(async keys => {
      batchCallCount++;
      return keys.map(k => `value-${k}`);
    });

    const [a, b, c] = await Promise.all([loader.load('k1'), loader.load('k2'), loader.load('k3')]);
    assert.equal(a, 'value-k1');
    assert.equal(b, 'value-k2');
    assert.equal(c, 'value-k3');
    assert.equal(batchCallCount, 1); // all in one batch
  });

  it('caches results within request cycle', async () => {
    let batchCallCount = 0;
    const loader = createDataLoader(async keys => {
      batchCallCount++;
      return keys.map(k => `val-${k}`);
    });

    await loader.load('x');
    await loader.load('x'); // should hit cache
    assert.equal(batchCallCount, 1);
  });

  it('clearCache() forces re-fetch', async () => {
    let batchCallCount = 0;
    const loader = createDataLoader(async keys => {
      batchCallCount++;
      return keys.map(() => 'v');
    });

    await loader.load('y');
    loader.clearCache();
    await loader.load('y');
    assert.equal(batchCallCount, 2);
  });

  it('loadMany() loads an array of keys', async () => {
    const loader = createDataLoader(async keys => keys.map(k => k.toUpperCase()));
    const results = await loader.loadMany(['a', 'b', 'c']);
    assert.deepEqual(results, ['A', 'B', 'C']);
  });
});

// ─── P52: Form State Manager ─────────────────────────────────────────────────
describe('P52: createFormState', () => {
  const validators = {
    name:  v => (!v || v.length < 2) ? 'Name too short' : null,
    email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Invalid email' : null
  };

  it('getValue reads initial values', () => {
    const form = createFormState({ name: 'Alice', email: '' }, validators);
    assert.equal(form.getValue('name'), 'Alice');
  });

  it('setValue updates field', () => {
    const form = createFormState({ name: '' }, validators);
    form.setValue('name', 'Bob');
    assert.equal(form.getValue('name'), 'Bob');
  });

  it('validate() returns true when all fields valid', () => {
    const form = createFormState({ name: '', email: '' }, validators);
    form.setValue('name', 'Alice');
    form.setValue('email', 'alice@example.com');
    assert.ok(form.validate());
  });

  it('validate() returns false and populates errors', () => {
    const form = createFormState({ name: 'X', email: 'bad' }, validators);
    assert.ok(!form.validate());
    const errors = form.getErrors();
    assert.ok(errors.name);
    assert.ok(errors.email);
  });

  it('isDirty() reflects change from initial values', () => {
    const form = createFormState({ name: 'Alice' }, {});
    assert.ok(!form.isDirty());
    form.setValue('name', 'Bob');
    assert.ok(form.isDirty());
  });

  it('reset() restores initial values and clears errors', () => {
    const form = createFormState({ name: 'Alice' }, validators);
    form.setValue('name', 'X');
    form.validate();
    form.reset();
    assert.equal(form.getValue('name'), 'Alice');
    assert.equal(Object.keys(form.getErrors()).length, 0);
  });
});

// ─── P53: Infinite Scroll Controller ─────────────────────────────────────────
describe('P53: createInfiniteScrollController', () => {
  function makeFetcher(totalPages) {
    return async (page) => ({
      items: [`item-${page * 2}`, `item-${page * 2 + 1}`],
      hasMore: page < totalPages - 1
    });
  }

  it('loadNext() loads first page', async () => {
    const ctrl = createInfiniteScrollController({ fetchPage: makeFetcher(3) });
    await ctrl.loadNext();
    assert.equal(ctrl.getItems().length, 2);
    assert.ok(ctrl.hasMore());
  });

  it('multiple loadNext() accumulates items', async () => {
    const ctrl = createInfiniteScrollController({ fetchPage: makeFetcher(3) });
    await ctrl.loadNext();
    await ctrl.loadNext();
    assert.equal(ctrl.getItems().length, 4);
  });

  it('hasMore() is false after last page', async () => {
    const ctrl = createInfiniteScrollController({ fetchPage: makeFetcher(2) });
    await ctrl.loadNext();
    await ctrl.loadNext();
    assert.ok(!ctrl.hasMore());
  });

  it('loadNext() is no-op when done', async () => {
    const ctrl = createInfiniteScrollController({ fetchPage: makeFetcher(1) });
    await ctrl.loadNext();
    await ctrl.loadNext(); // should not throw or fetch again
    assert.equal(ctrl.getItems().length, 2);
  });

  it('reset() clears state', async () => {
    const ctrl = createInfiniteScrollController({ fetchPage: makeFetcher(3) });
    await ctrl.loadNext();
    ctrl.reset();
    assert.equal(ctrl.getItems().length, 0);
    assert.ok(ctrl.hasMore());
  });
});

// ─── P54: G-Counter ───────────────────────────────────────────────────────────
describe('P54: createGCounter', () => {
  it('increment and value', () => {
    const c = createGCounter('A');
    c.increment(3);
    assert.equal(c.value(), 3);
  });

  it('merge takes element-wise max', () => {
    const cA = createGCounter('A');
    const cB = createGCounter('B');
    cA.increment(5);
    cB.increment(3);
    cA.merge(cB.getState());
    assert.equal(cA.value(), 8); // 5 + 3
  });

  it('merge is idempotent (applying same state twice gives same result)', () => {
    const cA = createGCounter('A');
    const cB = createGCounter('B');
    cA.increment(2); cB.increment(4);
    const stateB = cB.getState();
    cA.merge(stateB);
    cA.merge(stateB); // again
    assert.equal(cA.value(), 6);
  });

  it('merge is commutative', () => {
    const cA = createGCounter('A');
    const cB = createGCounter('B');
    cA.increment(10); cB.increment(20);

    const merged1 = createGCounter('X');
    merged1.merge(cA.getState());
    merged1.merge(cB.getState());

    const merged2 = createGCounter('X');
    merged2.merge(cB.getState());
    merged2.merge(cA.getState());

    assert.equal(merged1.value(), merged2.value());
  });
});

// ─── P55: Feature Flag Service ───────────────────────────────────────────────
describe('P55: createFeatureFlagService', () => {
  it('disabled flag returns false for everyone', () => {
    const ff = createFeatureFlagService({ darkMode: { enabled: false, rollout: 100 } });
    assert.ok(!ff.isEnabled('darkMode', 'user-1'));
  });

  it('100% rollout always returns true', () => {
    const ff = createFeatureFlagService({ feat: { enabled: true, rollout: 100 } });
    assert.ok(ff.isEnabled('feat', 'user-1'));
    assert.ok(ff.isEnabled('feat', 'user-abc'));
  });

  it('0% rollout returns false for everyone not in allowList', () => {
    const ff = createFeatureFlagService({ feat: { enabled: true, rollout: 0 } });
    assert.ok(!ff.isEnabled('feat', 'user-1'));
  });

  it('allowList users are always enabled regardless of rollout', () => {
    const ff = createFeatureFlagService({ feat: { enabled: true, rollout: 0, allowList: ['vip-user'] } });
    assert.ok(ff.isEnabled('feat', 'vip-user'));
    assert.ok(!ff.isEnabled('feat', 'regular-user'));
  });

  it('same userId always gets same result (stable)', () => {
    const ff = createFeatureFlagService({ feat: { enabled: true, rollout: 50 } });
    const result1 = ff.isEnabled('feat', 'stable-user-123');
    const result2 = ff.isEnabled('feat', 'stable-user-123');
    assert.equal(result1, result2);
  });
});

// ─── P56: A/B Test Assigner ───────────────────────────────────────────────────
describe('P56: createABTestAssigner', () => {
  const experiments = {
    checkout: {
      variants: [
        { name: 'control', weight: 50 },
        { name: 'variant-a', weight: 50 }
      ]
    }
  };

  it('assign() returns a valid variant name', () => {
    const ab = createABTestAssigner(experiments);
    const result = ab.assign('checkout', 'user-1');
    assert.ok(['control', 'variant-a'].includes(result));
  });

  it('same userId always gets same variant (stable)', () => {
    const ab = createABTestAssigner(experiments);
    const r1 = ab.assign('checkout', 'user-42');
    const r2 = ab.assign('checkout', 'user-42');
    assert.equal(r1, r2);
  });

  it('different userIds can get different variants', () => {
    const ab = createABTestAssigner(experiments);
    const results = new Set();
    for (let i = 0; i < 100; i++) results.add(ab.assign('checkout', `user-${i}`));
    assert.ok(results.size > 1, 'Expected both variants to appear across 100 users');
  });

  it('getAssignments() returns map for all experiments', () => {
    const ab = createABTestAssigner(experiments);
    const assignments = ab.getAssignments('user-7');
    assert.ok('checkout' in assignments);
  });

  it('throws for unknown experiment', () => {
    const ab = createABTestAssigner(experiments);
    assert.throws(() => ab.assign('unknown', 'u'), /not found/i);
  });
});
