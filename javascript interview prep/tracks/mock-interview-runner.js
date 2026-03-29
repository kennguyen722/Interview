#!/usr/bin/env node

const LEVEL_PROBLEMS = {
  novice: [
    'Normalize customer names safely',
    'Aggregate sales totals by category',
    'Validate signup payload fields',
    'Build safe nested object getter',
    'Parse and sanitize query params',
    'Find duplicate IDs in array input',
    'Implement basic event bus on/off/emit',
    'Build immutable cart update helper',
  ],
  intermediate: [
    'Implement custom bind with partial args',
    'Deep clone with circular references',
    'Safe deep merge with prototype pollution guard',
    'Property descriptor locking for config object',
    'WeakMap memoization for object keys',
    'Generator-based plugin pipeline',
    'Optional chaining/nullish projection mapper',
    'CommonJS vs ESM migration decision',
  ],
  advanced: [
    'Bounded concurrency runner with ordered output',
    'Timeout + retry + jitter wrapper',
    'Circuit breaker with half-open probe logic',
    'Token bucket limiter by tenant',
    'Cursor pagination with stable ordering',
    'N+1 elimination via batch query strategy',
    'Node stream line parser transform',
    'Backpressure-safe JSONL writer',
    'Abort-signal-aware ingestion pipeline',
  ],
  expert: [
    'BFF dashboard with partial fallback',
    'Saga compensation plan for checkout workflow',
    'SLO and error budget policy design',
    'Multi-region failover tradeoff analysis',
    'Security checklist scoring and remediation plan',
    'Incident command timeline and ownership map',
    'ADR: REST vs GraphQL for multi-client platform',
    'Principal readiness rubric calibration',
  ],
  roku: [
    'Ad impression deduper with idempotency key TTL',
    'Campaign pacing algorithm with hourly budget guards',
    'Audience segment matcher with include/exclude precedence',
    'Backpressure-safe event ingestion for ad telemetry',
    'Abortable fan-out to measurement partners with timeout budget',
    'Streaming join of impression and conversion events',
    'Rate-limited reporting API with cursor pagination',
    'Multi-tenant quota enforcement for Ads Manager APIs',
    'Debug stale dashboard metrics under eventual consistency',
    'Design remediation for duplicate conversion attribution',
  ],
};

const ROUND_TEMPLATES = {
  novice: [
    { name: 'Coding Fundamentals', minutes: 45, picks: 2 },
    { name: 'Practical Logic Drill', minutes: 30, picks: 1 },
    { name: 'Review and Reflection', minutes: 15, picks: 0 },
  ],
  intermediate: [
    { name: 'Coding Round', minutes: 60, picks: 2 },
    { name: 'Language Deep-Dive', minutes: 30, picks: 1 },
    { name: 'Debugging and Tradeoffs', minutes: 30, picks: 1 },
  ],
  advanced: [
    { name: 'Algorithm and Concurrency', minutes: 60, picks: 2 },
    { name: 'API and Reliability', minutes: 45, picks: 1 },
    { name: 'Debugging', minutes: 30, picks: 1 },
    { name: 'Design Discussion', minutes: 30, picks: 1 },
  ],
  expert: [
    { name: 'Advanced Coding and Reliability', minutes: 60, picks: 2 },
    { name: 'System Design', minutes: 60, picks: 1 },
    { name: 'Architecture Review', minutes: 45, picks: 1 },
    { name: 'Leadership and Judgment', minutes: 30, picks: 1 },
  ],
  roku: [
    { name: 'Practical JavaScript Coding', minutes: 60, picks: 2 },
    { name: 'Backend API and Reliability', minutes: 45, picks: 1 },
    { name: 'Ad Tech Debugging Scenario', minutes: 35, picks: 1 },
    { name: 'System Design: Ads + Measurement', minutes: 45, picks: 1 },
    { name: 'Senior Ownership and Tradeoffs', minutes: 25, picks: 1 },
  ],
};

function parseArgs(argv) {
  const out = { level: 'advanced', seed: Date.now() };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--level' && argv[i + 1]) {
      out.level = argv[i + 1].toLowerCase();
      i += 1;
    } else if (arg === '--seed' && argv[i + 1]) {
      out.seed = Number(argv[i + 1]);
      i += 1;
    }
  }
  return out;
}

function createPrng(seed) {
  let state = (seed >>> 0) || 1;
  return function rand() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pickUnique(items, count, rand) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr.slice(0, Math.min(count, arr.length));
}

function generateSession(level, seed) {
  if (!LEVEL_PROBLEMS[level]) {
    throw new Error(`Unsupported level: ${level}. Use novice|intermediate|advanced|expert|roku.`);
  }

  const rand = createPrng(seed);
  const rounds = ROUND_TEMPLATES[level];
  const problems = LEVEL_PROBLEMS[level];
  const shuffledPool = pickUnique(problems, problems.length, rand);
  let poolCursor = 0;

  const session = rounds.map((round) => ({
    ...round,
    tasks: (() => {
      if (round.picks <= 0) return [];

      const primary = [];
      while (primary.length < round.picks && poolCursor < shuffledPool.length) {
        primary.push(shuffledPool[poolCursor]);
        poolCursor += 1;
      }

      if (primary.length === round.picks) return primary;

      const need = round.picks - primary.length;
      const fallback = pickUnique(problems, need, rand);
      return primary.concat(fallback);
    })(),
  }));

  const totalMinutes = session.reduce((sum, r) => sum + r.minutes, 0);

  return { level, seed, totalMinutes, rounds: session };
}

function printSession(session) {
  console.log('=== JavaScript Mock Interview Session ===');
  console.log(`Level: ${session.level}`);
  console.log(`Seed: ${session.seed}`);
  console.log(`Total time: ${session.totalMinutes} minutes`);
  console.log('');

  session.rounds.forEach((round, idx) => {
    console.log(`${idx + 1}. ${round.name} (${round.minutes} min)`);
    if (round.tasks.length === 0) {
      console.log('   - Reflect on mistakes, document tradeoffs, define improvements.');
    } else {
      round.tasks.forEach((task) => {
        console.log(`   - ${task}`);
      });
    }
  });

  console.log('');
  console.log('Checklist:');
  console.log('- Clarify assumptions before coding.');
  console.log('- State complexity and tradeoffs.');
  console.log('- Add edge-case tests.');
  console.log('- Summarize production risks and mitigations.');
}

function main() {
  const { level, seed } = parseArgs(process.argv);
  const session = generateSession(level, seed);
  printSession(session);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { generateSession, parseArgs, createPrng };
