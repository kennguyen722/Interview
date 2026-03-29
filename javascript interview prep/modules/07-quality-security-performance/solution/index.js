function verifyCsrf(req) {
  const cookie = req.cookies?.csrf;
  const header = req.headers?.['x-csrf-token'];
  return Boolean(cookie && header && cookie === header);
}

function summarizePercentiles(samples) {
  if (samples.length === 0) return { p50: 0, p95: 0, p99: 0 };
  const sorted = samples.slice().sort((a, b) => a - b);
  const pick = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
  return { p50: pick(0.5), p95: pick(0.95), p99: pick(0.99) };
}

module.exports = { verifyCsrf, summarizePercentiles };
