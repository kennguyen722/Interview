'use strict';
// Module 18: Observability & Production Readiness — Reference Solution

const crypto = require('crypto');

// ─── 1. Structured Logger ────────────────────────────────────────────────────
const LEVELS = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5 };

function createLogger({ name = 'app', level = 'info', redactFields = [], _entries = [], _silent = false } = {}) {
  const minLevel = LEVELS[level] ?? LEVELS.info;

  function redact(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const result = { ...obj };
    for (const field of redactFields) {
      if (field in result) result[field] = '[REDACTED]';
    }
    return result;
  }

  function log(lvl, msg, context = {}) {
    if ((LEVELS[lvl] ?? 0) < minLevel) return;
    const entry = {
      level: lvl,
      name,
      msg,
      time: new Date().toISOString(),
      ...redact(context)
    };
    _entries.push(entry);
    if (!_silent) console.log(JSON.stringify(entry));
  }

  const logger = {
    trace: (msg, ctx) => log('trace', msg, ctx),
    debug: (msg, ctx) => log('debug', msg, ctx),
    info:  (msg, ctx) => log('info',  msg, ctx),
    warn:  (msg, ctx) => log('warn',  msg, ctx),
    error: (msg, ctx) => log('error', msg, ctx),
    fatal: (msg, ctx) => log('fatal', msg, ctx),
    log,
    child(extraContext) {
      return createLogger({
        name: extraContext.name || name,
        level,
        redactFields,
        _entries,
        _silent,
        _extraContext: extraContext
      });
    },
    getEntries: () => [..._entries]
  };

  return logger;
}

// ─── 2. Metrics: Counter, Gauge, Histogram ───────────────────────────────────
function createMetricsRegistry() {
  const counters   = new Map();
  const gauges     = new Map();
  const histograms = new Map();

  function counter(name) {
    if (!counters.has(name)) counters.set(name, 0);
    return {
      increment: (n = 1) => counters.set(name, counters.get(name) + n),
      reset: () => counters.set(name, 0),
      value: () => counters.get(name)
    };
  }

  function gauge(name) {
    if (!gauges.has(name)) gauges.set(name, 0);
    return {
      set: (n) => gauges.set(name, n),
      increment: (n = 1) => gauges.set(name, gauges.get(name) + n),
      decrement: (n = 1) => gauges.set(name, gauges.get(name) - n),
      value: () => gauges.get(name)
    };
  }

  function histogram(name) {
    if (!histograms.has(name)) histograms.set(name, []);
    const values = histograms.get(name);
    return {
      record: (v) => values.push(v),
      percentile(p) {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const idx = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[Math.max(0, idx)];
      },
      count: () => values.length,
      sum: () => values.reduce((a, b) => a + b, 0),
      mean: () => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
    };
  }

  function getAll() {
    return {
      counters:   Object.fromEntries([...counters]),
      gauges:     Object.fromEntries([...gauges]),
      histograms: Object.fromEntries([...histograms].map(([k, v]) => [k, { count: v.length, sum: v.reduce((a, b) => a + b, 0) }]))
    };
  }

  return { counter, gauge, histogram, getAll };
}

// ─── 3. Distributed Trace Span ───────────────────────────────────────────────
function createTracer() {
  function hex(bytes) { return crypto.randomBytes(bytes).toString('hex'); }

  function startSpan(name, parentContext = null) {
    const traceId     = parentContext?.traceId || hex(16);
    const spanId      = hex(8);
    const parentSpanId = parentContext?.spanId || null;
    const startTime   = Date.now();
    let endTime       = null;

    return {
      name,
      traceId,
      spanId,
      parentSpanId,
      startTime,
      end() { endTime = Date.now(); },
      duration() { return (endTime ?? Date.now()) - startTime; },
      toHeader() { return `00-${traceId}-${spanId}-01`; },
      getContext() { return { traceId, spanId }; }
    };
  }

  function parseHeader(traceparent) {
    const parts = (traceparent || '').split('-');
    if (parts.length < 4) return null;
    return { traceId: parts[1], parentSpanId: parts[2] };
  }

  return { startSpan, parseHeader };
}

// ─── 4. Health Check Aggregator ──────────────────────────────────────────────
function createHealthChecker() {
  const checks = new Map();

  function register(name, checkFn) {
    checks.set(name, checkFn);
  }

  async function check() {
    const results = {};
    let overallStatus = 'healthy';

    await Promise.all([...checks.entries()].map(async ([name, fn]) => {
      const start = Date.now();
      try {
        const result = await fn();
        const latencyMs = Date.now() - start;
        results[name] = { status: result.status, latencyMs, message: result.message };
        if (result.status === 'warn' && overallStatus === 'healthy') overallStatus = 'degraded';
        if (result.status === 'error') overallStatus = 'unhealthy';
      } catch (e) {
        results[name] = { status: 'error', latencyMs: Date.now() - start, error: e.message };
        overallStatus = 'unhealthy';
      }
    }));

    return { status: overallStatus, checks: results };
  }

  return { register, check };
}

// ─── 5. SLO Tracker with Error Budget ────────────────────────────────────────
function createSLOTracker({ target, windowMs = 60_000 }) {
  const events = []; // { ts: number, success: boolean }

  function record(success) {
    events.push({ ts: Date.now(), success });
  }

  function getStatus() {
    const cutoff = Date.now() - windowMs;
    const window = events.filter(e => e.ts >= cutoff);
    const total    = window.length;
    const failures = window.filter(e => !e.success).length;

    if (total === 0) return { slo: target, actual: 1, errorBudget: 1 - target, burnRate: 0, ok: true };

    const actual      = (total - failures) / total;
    const errorBudget = Math.max(0, (1 - target) - (1 - actual));
    const expectedFailureRate = 1 - target;
    const actualFailureRate   = 1 - actual;
    const burnRate = expectedFailureRate > 0 ? actualFailureRate / expectedFailureRate : 0;

    return {
      slo:         target,
      actual:      Math.round(actual * 10000) / 10000,
      errorBudget: Math.round(errorBudget * 10000) / 10000,
      burnRate:    Math.round(burnRate * 100) / 100,
      ok:          actual >= target
    };
  }

  return { record, getStatus };
}

// ─── 6. Alert Rule Engine ─────────────────────────────────────────────────────
function createAlertEngine() {
  const rules     = new Map();
  const cooldowns = new Map();

  function addRule({ name, condition, message, cooldownMs = 60_000 }) {
    rules.set(name, { condition, message, cooldownMs });
  }

  function evaluate(metrics) {
    const fired = [];
    const now = Date.now();

    for (const [name, rule] of rules) {
      const lastFired = cooldowns.get(name) || 0;
      if (now - lastFired < rule.cooldownMs) continue; // Still in cooldown

      let triggered;
      try { triggered = rule.condition(metrics); }
      catch { triggered = false; }

      if (triggered) {
        cooldowns.set(name, now);
        fired.push({ name, message: rule.message, firedAt: new Date(now).toISOString() });
      }
    }

    return fired;
  }

  return { addRule, evaluate };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  // Logger
  const log = createLogger({ name: 'api', level: 'debug', redactFields: ['password', 'token'], _silent: true });
  log.info('Request received', { path: '/login', password: 'secret123' });
  const entries = log.getEntries();
  console.log('Logger redacted:', entries[0].password === '[REDACTED]', '| msg:', entries[0].msg);

  // Metrics
  const metrics = createMetricsRegistry();
  const reqCount = metrics.counter('http_requests');
  reqCount.increment(); reqCount.increment(3);
  const latency = metrics.histogram('request_latency_ms');
  [120, 145, 190, 250, 800].forEach(v => latency.record(v));
  console.log(`Metrics: requests=${reqCount.value()} | p95 latency=${latency.percentile(95)}ms`);

  // Tracer
  const tracer = createTracer();
  const rootSpan = tracer.startSpan('incoming-request');
  const childSpan = tracer.startSpan('db-query', rootSpan.getContext());
  childSpan.end();
  rootSpan.end();
  console.log('Trace header:', rootSpan.toHeader().startsWith('00-'));
  console.log('Same traceId:', rootSpan.traceId === childSpan.traceId);
  console.log('Child parent:', childSpan.parentSpanId === rootSpan.spanId);

  // Health Checker
  const health = createHealthChecker();
  health.register('db',    async () => ({ status: 'ok', message: 'connected' }));
  health.register('cache', async () => ({ status: 'warn', message: 'high latency' }));
  health.check().then(r => console.log('Health status:', r.status)); // degraded

  // SLO Tracker
  const slo = createSLOTracker({ target: 0.999 });
  for (let i = 0; i < 1000; i++) slo.record(i < 995); // 5 failures out of 1000
  const status = slo.getStatus();
  console.log(`SLO: target=${status.slo} actual=${status.actual} ok=${status.ok} burnRate=${status.burnRate}`);

  // Alert Engine
  const alerts = createAlertEngine();
  alerts.addRule({ name: 'high-error-rate', condition: m => m.errorRate > 0.05, message: 'Error rate exceeded 5%', cooldownMs: 0 });
  const fired = alerts.evaluate({ errorRate: 0.10, latencyP99: 300 });
  console.log('Alert fired:', fired[0]?.name);
}

module.exports = { LEVELS, createLogger, createMetricsRegistry, createTracer, createHealthChecker, createSLOTracker, createAlertEngine };
