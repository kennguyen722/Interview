const assert = require('node:assert/strict');
const S = require('./coding-solutions');

async function main() {
  const ctx = { x: 10 };
  function add(a, b) { return this.x + a + b; }
  const bound = S.myBind(add, ctx, 2);
  assert.equal(bound(3), 15);

  const src = { a: 1 }; src.self = src;
  const cloned = S.deepClone(src);
  assert.equal(cloned.self, cloned);

  const pa = await S.promiseAll([Promise.resolve(1), 2, Promise.resolve(3)]);
  assert.deepEqual(pa, [1, 2, 3]);

  const poolOut = await S.runPool([
    async () => 1,
    async () => 2,
    async () => 3,
  ], 2);
  assert.deepEqual(poolOut, [1, 2, 3]);

  assert.deepEqual(S.twoSum([2, 7, 11, 15], 9), [0, 1]);
  assert.deepEqual(S.maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);

  const range = S.getWindowRange(200, 300, 50, 100, 2);
  assert.equal(range.start >= 0, true);

  const cursor = S.encodeCursor({ createdAt: '2026-01-01T00:00:00.000Z', id: 'o1' });
  assert.deepEqual(S.decodeCursor(cursor), { createdAt: '2026-01-01T00:00:00.000Z', id: 'o1' });

  const flag = S.isEnabled('f1', 'u1', 50);
  assert.equal(typeof flag, 'boolean');

  const flaky = S.summarizeFlakyTests([
    { testName: 't1', status: 'fail' },
    { testName: 't1', status: 'pass' },
  ]);
  assert.deepEqual(flaky, []);

  const bulkhead = S.createBulkhead(1);
  const hold = bulkhead(async () => new Promise((resolve) => setTimeout(() => resolve('ok'), 20)));
  await assert.rejects(() => bulkhead(async () => 'x'), /BULKHEAD_REJECTED/);
  assert.equal(await hold, 'ok');

  const chosen = S.chooseRegion({ health: { us: 'down', eu: 'healthy' }, preferredRegion: 'us', mode: 'read' });
  assert.equal(chosen, 'eu');

  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  let nextCalled = false;
  S.verifyCsrf({ cookies: { csrf: 'a' }, headers: { 'x-csrf-token': 'a' } }, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);

  const check = S.evaluateSecurityReview({
    'authn-authz-validated': true,
    'input-validation-boundary': true,
    'injection-safe-queries': true,
    'secrets-not-hardcoded': true,
    'pii-redaction-logs': true,
  });
  assert.equal(check.pass, true);

  const job = S.buildNotificationJob({ userId: 'u1', channels: ['email'], templateId: 't1', idempotencyKey: 'k1' });
  assert.equal(job.status, 'queued');
  assert.equal(S.nextRetryDelayMs(5) <= 60000, true);

  assert.equal(S.estimateQps({ dau: 100000, requestsPerUserPerDay: 12 }) > 0, true);
  assert.equal(S.estimateStorageGbPerDay({ eventsPerDay: 1000000, avgEventBytes: 512 }) > 0, true);

  const adr = S.buildAdr({ title: 'API strategy', context: 'ctx', options: [], decision: 'REST', consequences: [] });
  assert.equal(adr.status, 'accepted');

  const readiness = S.principalReadinessScore({
    systemOwnership: 4,
    reliabilityPosture: 4,
    crossTeamInfluence: 5,
    mentoringImpact: 4,
  });
  assert.equal(readiness > 0, true);

  console.log('All coding solutions ran successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
