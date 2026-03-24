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

function chooseRegion({ health, preferredRegion, mode }) {
  if (health[preferredRegion] === 'healthy') return preferredRegion;
  const fallback = Object.keys(health).find((r) => health[r] === 'healthy');
  if (!fallback) throw new Error('NO_HEALTHY_REGION');
  if (mode === 'write-strict') throw new Error('PRIMARY_UNAVAILABLE_FOR_WRITES');
  return fallback;
}

module.exports = { createBulkhead, chooseRegion };
