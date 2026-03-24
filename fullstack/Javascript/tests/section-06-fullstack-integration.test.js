const test = require('node:test');
const assert = require('node:assert/strict');

async function bffDashboard({ services, timeoutMs = 800 }) {
  const calls = [
    ['profile', services.profile()],
    ['orders', services.orders()],
    ['recs', services.recommendations()],
  ];

  const out = { data: {}, errors: [] };

  await Promise.all(calls.map(async ([name, p]) => {
    try {
      const value = await Promise.race([
        p,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
      ]);
      out.data[name] = value;
    } catch (err) {
      out.data[name] = null;
      out.errors.push({ dependency: name, reason: err.message });
    }
  }));

  return out;
}

function applyOptimisticLike(state, postId) {
  const prev = state.posts[postId].likes;
  state.posts[postId].likes = prev + 1;
  return () => {
    state.posts[postId].likes = prev;
  };
}

function hashDjb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) {
    h = ((h << 5) + h) + str.charCodeAt(i);
  }
  return h >>> 0;
}

function isEnabled(flagKey, userId, rolloutPercent) {
  const bucket = hashDjb2(`${flagKey}:${userId}`) % 100;
  return bucket < rolloutPercent;
}

test('bffDashboard returns partial response with dependency errors', async () => {
  const services = {
    profile: async () => ({ id: 'u1' }),
    orders: async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      return [{ id: 'o1' }];
    },
    recommendations: async () => {
      throw new Error('upstream down');
    },
  };

  const out = await bffDashboard({ services, timeoutMs: 50 });

  assert.deepEqual(out.data.profile, { id: 'u1' });
  assert.deepEqual(out.data.orders, [{ id: 'o1' }]);
  assert.equal(out.data.recs, null);
  assert.equal(out.errors.length, 1);
  assert.equal(out.errors[0].dependency, 'recs');
});

test('applyOptimisticLike increments then rollback restores previous value', () => {
  const state = { posts: { p1: { likes: 5 } } };
  const rollback = applyOptimisticLike(state, 'p1');

  assert.equal(state.posts.p1.likes, 6);
  rollback();
  assert.equal(state.posts.p1.likes, 5);
});

test('isEnabled is deterministic for same user and flag', () => {
  const a = isEnabled('new-checkout', 'user-42', 30);
  const b = isEnabled('new-checkout', 'user-42', 30);
  assert.equal(a, b);
});

test('isEnabled honors rollout bounds', () => {
  assert.equal(isEnabled('any-flag', 'any-user', 0), false);
  assert.equal(isEnabled('any-flag', 'any-user', 100), true);
});
