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

function hashDjb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i += 1) h = ((h << 5) + h) + str.charCodeAt(i);
  return h >>> 0;
}

function isEnabled(flagKey, userId, rolloutPercent) {
  const bucket = hashDjb2(`${flagKey}:${userId}`) % 100;
  return bucket < rolloutPercent;
}

module.exports = { bffDashboard, isEnabled };
