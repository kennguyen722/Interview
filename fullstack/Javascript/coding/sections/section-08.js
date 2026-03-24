async function retryWithInjectedSleep(fn, { maxAttempts = 3, sleep }) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      return await fn({ attempt });
    } catch (err) {
      if (attempt >= maxAttempts) throw err;
      await sleep(2 ** attempt * 10);
    }
  }
}

function summarizeFlakyTests(historyRows) {
  const totals = new Map();
  for (const row of historyRows) {
    const key = row.testName;
    const entry = totals.get(key) || { runs: 0, fails: 0 };
    entry.runs += 1;
    entry.fails += row.status === 'fail' ? 1 : 0;
    totals.set(key, entry);
  }

  return Array.from(totals.entries())
    .map(([testName, s]) => ({
      testName,
      flakeRate: s.runs === 0 ? 0 : s.fails / s.runs,
      runs: s.runs,
    }))
    .filter((x) => x.runs >= 20 && x.flakeRate >= 0.05)
    .sort((a, b) => b.flakeRate - a.flakeRate);
}

module.exports = { retryWithInjectedSleep, summarizeFlakyTests };
