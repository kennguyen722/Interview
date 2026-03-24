const test = require('node:test');
const assert = require('node:assert/strict');

function createBulkhead(limit = 20) {
  let inUse = 0;
  return async function run(fn) {
    if (inUse >= limit) throw new Error('BULKHEAD_REJECTED');
    inUse += 1;
    try {
      return await fn();
    } finally {
      inUse -= 1;
    }
  };
}

function jitteredTtl(baseMs) {
  return baseMs + Math.floor(Math.random() * (baseMs * 0.1));
}

async function resilientCall(call, wrappers) {
  return wrappers.reduceRight((acc, wrap) => () => wrap(acc), call)();
}

test('createBulkhead rejects when concurrency limit reached', async () => {
  const run = createBulkhead(1);

  const hold = run(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return 'done';
  });

  await assert.rejects(
    () => run(async () => 'second'),
    /BULKHEAD_REJECTED/
  );

  assert.equal(await hold, 'done');
});

test('jitteredTtl returns value within expected range', () => {
  for (let i = 0; i < 200; i += 1) {
    const v = jitteredTtl(1000);
    assert.equal(v >= 1000 && v < 1100, true);
  }
});

test('resilientCall composes wrappers in order', async () => {
  const sequence = [];
  const call = async () => {
    sequence.push('call');
    return 'ok';
  };

  const w1 = (next) => {
    sequence.push('w1-before');
    return next().then((v) => {
      sequence.push('w1-after');
      return v;
    });
  };

  const w2 = (next) => {
    sequence.push('w2-before');
    return next().then((v) => {
      sequence.push('w2-after');
      return v;
    });
  };

  const out = await resilientCall(call, [w1, w2]);
  assert.equal(out, 'ok');
  assert.deepEqual(sequence, ['w1-before', 'w2-before', 'call', 'w2-after', 'w1-after']);
});
