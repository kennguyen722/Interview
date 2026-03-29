function normalizeCustomerNames(names) {
  return names.map((n) => String(n || '').trim().toLowerCase().replace(/\s+/g, ' '));
}

function aggregateSalesByRegion(rows) {
  return rows.reduce((acc, r) => {
    acc[r.region] = (acc[r.region] || 0) + Number(r.amount || 0);
    return acc;
  }, {});
}

function findDuplicateIds(ids) {
  const seen = new Set();
  const dup = new Set();
  for (const id of ids) {
    if (seen.has(id)) dup.add(id);
    seen.add(id);
  }
  return [...dup];
}

function deepGet(obj, path, fallback = undefined) {
  const keys = Array.isArray(path) ? path : String(path).split('.');
  let cur = obj;
  for (const key of keys) {
    if (cur == null || !(key in cur)) return fallback;
    cur = cur[key];
  }
  return cur;
}

function validatePasswordPolicy(pwd, { minLen = 8 } = {}) {
  return /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd) && String(pwd).length >= minLen;
}

function computeTaxBrackets(income, brackets) {
  let remaining = income;
  let tax = 0;
  let prevLimit = 0;
  for (const b of brackets) {
    const taxable = Math.max(0, Math.min(remaining, b.limit - prevLimit));
    tax += taxable * b.rate;
    remaining -= taxable;
    prevLimit = b.limit;
    if (remaining <= 0) break;
  }
  if (remaining > 0 && brackets.length) tax += remaining * brackets[brackets.length - 1].rate;
  return Number(tax.toFixed(2));
}

function flattenNestedArrays(input) {
  return input.flatMap((x) => (Array.isArray(x) ? flattenNestedArrays(x) : [x]));
}

function detectInvalidDateRanges(ranges) {
  return ranges.filter((r) => new Date(r.start) > new Date(r.end));
}

function groupRecordsByStatus(rows) {
  return rows.reduce((acc, r) => {
    const k = r.status || 'unknown';
    (acc[k] ||= []).push(r);
    return acc;
  }, {});
}

function mergeUniqueTags(products) {
  return [...new Set(products.flatMap((p) => p.tags || []))];
}

function countWordFrequency(text) {
  const words = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
  return words.reduce((acc, w) => ((acc[w] = (acc[w] || 0) + 1), acc), {});
}

function parseRobustNumber(input) {
  const cleaned = String(input).replace(/,/g, '').trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function validateUrlFormat(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function simulateFetchFallback(primaryOk, fallbackValue) {
  return primaryOk ? 'primary' : fallbackValue;
}

function buildExpenseTracker(entries) {
  const total = entries.reduce((s, e) => s + Number(e.amount || 0), 0);
  const byCategory = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
    return acc;
  }, {});
  return { total, byCategory };
}

module.exports = {
  normalizeCustomerNames,
  aggregateSalesByRegion,
  findDuplicateIds,
  deepGet,
  validatePasswordPolicy,
  computeTaxBrackets,
  flattenNestedArrays,
  detectInvalidDateRanges,
  groupRecordsByStatus,
  mergeUniqueTags,
  countWordFrequency,
  parseRobustNumber,
  validateUrlFormat,
  simulateFetchFallback,
  buildExpenseTracker,
};
