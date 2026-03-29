// Capstone 01 starter:
// Implement a deterministic discount rules engine with strict schema validation.
// Keep outputs stable for identical input and include defensive error handling.
class RuleSchemaError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RuleSchemaError';
    this.code = 'RULE_SCHEMA_ERROR';
  }
}

// Parse config.rules and normalize rule objects for validation.
function parseRules(config) {
  throw new Error('TODO: implement parseRules');
}

// Validate required fields/types and return rules in deterministic sort order.
function validateRuleSchemas(rules) {
  throw new Error('TODO: implement validateRuleSchemas');
}

// Evaluate matching rules, compute discount amount, and return final pricing breakdown.
function evaluateOrderDiscount(order, config) {
  throw new Error('TODO: implement evaluateOrderDiscount');
}

module.exports = {
  RuleSchemaError,
  parseRules,
  validateRuleSchemas,
  evaluateOrderDiscount,
};
