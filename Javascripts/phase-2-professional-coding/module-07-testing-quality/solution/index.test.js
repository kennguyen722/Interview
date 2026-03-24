'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateInvoiceTotal, classifyError } = require('./index');

test('calculateInvoiceTotal should include tax', () => {
  const lines = [
    { qty: 2, price: 10 },
    { qty: 1, price: 5.5 }
  ];
  assert.equal(calculateInvoiceTotal(lines, 0.1), 28.05);
});

test('calculateInvoiceTotal should return 0 for empty lines', () => {
  assert.equal(calculateInvoiceTotal([], 0.1), 0);
});

test('classifyError should mark timeout as retryable', () => {
  const result = classifyError(new Error('Request timeout while calling provider'));
  assert.equal(result, 'retryable');
});

test('classifyError should mark validation as fatal', () => {
  const result = classifyError(new Error('Validation failed: bad payload'));
  assert.equal(result, 'fatal');
});
