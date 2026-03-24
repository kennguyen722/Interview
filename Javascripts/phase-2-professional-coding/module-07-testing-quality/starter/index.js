'use strict';

function calculateInvoiceTotal(lines, taxRate) {
  // TODO: sum line price * qty, then apply taxRate.
  throw new Error('Not implemented');
}

function classifyError(error) {
  // TODO: return 'retryable' for network/timeouts, else 'fatal'.
  throw new Error('Not implemented');
}

module.exports = {
  calculateInvoiceTotal,
  classifyError
};
