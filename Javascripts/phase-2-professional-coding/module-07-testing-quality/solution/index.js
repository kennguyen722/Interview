'use strict';

function calculateInvoiceTotal(lines, taxRate) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return 0;
  }
  const subtotal = lines.reduce((acc, line) => {
    const qty = Number(line.qty ?? 0);
    const price = Number(line.price ?? 0);
    return acc + (qty * price);
  }, 0);

  const total = subtotal * (1 + taxRate);
  return Number(total.toFixed(2));
}

function classifyError(error) {
  const msg = String(error?.message ?? '').toLowerCase();
  if (msg.includes('timeout') || msg.includes('network') || msg.includes('temporarily')) {
    return 'retryable';
  }
  return 'fatal';
}

module.exports = {
  calculateInvoiceTotal,
  classifyError
};
