class RuleSchemaError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RuleSchemaError';
    this.code = 'RULE_SCHEMA_ERROR';
  }
}

// Parse and normalize incoming rule configuration before schema validation.
function parseRules(config) {
  if (!config || !Array.isArray(config.rules)) {
    throw new RuleSchemaError('config.rules must be an array');
  }
  const cloned = config.rules.map((r) => ({ ...r }));
  return validateRuleSchemas(cloned);
}

// Enforce strict schema rules and sort deterministically for stable outputs.
function validateRuleSchemas(rules) {
  const ids = new Set();
  for (const rule of rules) {
    if (typeof rule.id !== 'string' || !rule.id.trim()) {
      throw new RuleSchemaError('rule.id must be a non-empty string');
    }
    if (ids.has(rule.id)) {
      throw new RuleSchemaError(`duplicate rule id: ${rule.id}`);
    }
    ids.add(rule.id);

    if (rule.type !== 'percent') {
      throw new RuleSchemaError('rule.type must be percent');
    }
    if (!['eq', 'gte'].includes(rule.op)) {
      throw new RuleSchemaError('rule.op must be eq or gte');
    }
    if (!Number.isFinite(rule.discountPct) || rule.discountPct < 0 || rule.discountPct > 100) {
      throw new RuleSchemaError('rule.discountPct must be between 0 and 100');
    }
    if (!Number.isFinite(rule.priority)) {
      throw new RuleSchemaError('rule.priority must be numeric');
    }
  }

  // Deterministic ordering by priority, then id.
  return rules.slice().sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

function doesRuleMatch(order, rule) {
  const value = order[rule.field];
  if (rule.op === 'eq') return value === rule.value;
  if (rule.op === 'gte') return Number(value) >= Number(rule.value);
  return false;
}

// Evaluate all matching rules and clamp cumulative discount defensively.
function evaluateOrderDiscount(order, config) {
  const rules = parseRules(config);
  const appliedRules = [];
  let totalDiscountPct = 0;

  for (const rule of rules) {
    if (doesRuleMatch(order, rule)) {
      appliedRules.push(rule.id);
      totalDiscountPct += rule.discountPct;
    }
  }

  totalDiscountPct = Math.min(90, totalDiscountPct);
  const subtotal = Number(order.subtotal || 0);
  const discountAmount = Number(((subtotal * totalDiscountPct) / 100).toFixed(2));
  const finalTotal = Number((subtotal - discountAmount).toFixed(2));

  return {
    appliedRules,
    totalDiscountPct,
    discountAmount,
    finalTotal,
  };
}

module.exports = {
  RuleSchemaError,
  parseRules,
  validateRuleSchemas,
  evaluateOrderDiscount,
};
