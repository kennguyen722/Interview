function eventLoopTopic(order) {
  return order.join('->');
}

async function promiseCombinatorsTopic(promises) {
  const settled = await Promise.allSettled(promises);
  return settled.map((s) => s.status);
}

async function asyncAwaitErrorBoundaryTopic(task) {
  try { return { ok: true, value: await task() }; } catch (e) { return { ok: false, error: e.message }; }
}

function cancellationAbortControllerTopic(signal) {
  if (signal?.aborted) throw new Error('ABORTED');
  return 'active';
}

async function concurrencyPoolTopic(tasks, limit = 2) {
  const out = []; let idx = 0;
  async function worker() { while (idx < tasks.length) { const i = idx++; out[i] = await tasks[i](); } }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return out;
}

async function retryBackoffJitterTopic(task, retries = 2) {
  let last;
  for (let i = 0; i <= retries; i += 1) { try { return await task(); } catch (e) { last = e; } }
  throw last;
}

async function nodeStreamsBasicsTopic(readable) {
  let bytes = 0;
  for await (const c of readable) bytes += Buffer.byteLength(c);
  return bytes;
}

function backpressureConceptTopic(canWrite) {
  return canWrite ? 'continue' : 'wait-drain';
}

function abortSignalsTopic(signal) {
  return signal?.aborted ? 'cancelled' : 'running';
}

async function boundedConcurrencyTaskRunnerLab(tasks) {
  return concurrencyPoolTopic(tasks, 2);
}

async function timeoutCancellationFetchLab(task, timeoutMs = 10) {
  return Promise.race([task(), new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeoutMs))]);
}

function inflightRequestCoalescerLab() {
  const inflight = new Map();
  return async (key, loader) => {
    if (!inflight.has(key)) inflight.set(key, Promise.resolve(loader()).finally(() => inflight.delete(key)));
    return inflight.get(key);
  };
}

async function retryWrapperLab(fn, retries = 1) {
  return retryBackoffJitterTopic(fn, retries);
}

function inMemoryQueueBackpressureLab(limit = 2) {
  const q = [];
  return { push(item) { if (q.length >= limit) return false; q.push(item); return true; }, size() { return q.length; } };
}

module.exports = {
  eventLoopTopic,
  promiseCombinatorsTopic,
  asyncAwaitErrorBoundaryTopic,
  cancellationAbortControllerTopic,
  concurrencyPoolTopic,
  retryBackoffJitterTopic,
  nodeStreamsBasicsTopic,
  backpressureConceptTopic,
  abortSignalsTopic,
  boundedConcurrencyTaskRunnerLab,
  timeoutCancellationFetchLab,
  inflightRequestCoalescerLab,
  retryWrapperLab,
  inMemoryQueueBackpressureLab,
};
