'use strict';

function validate(body) {
  if (!body || typeof body !== 'object') {
    return 'body is required';
  }
  if (typeof body.amount !== 'number' || body.amount <= 0) {
    return 'amount must be a positive number';
  }
  if (typeof body.currency !== 'string' || body.currency.length !== 3) {
    return 'currency must be 3-letter code';
  }
  return null;
}

function createPaymentHandler(provider) {
  const idemStore = new Map();

  return async function handle(request) {
    const key = request.headers?.['idempotency-key'];
    if (!key) {
      return { status: 400, body: { error: 'idempotency-key header is required' } };
    }

    if (idemStore.has(key)) {
      return { status: 200, body: idemStore.get(key), reused: true };
    }

    const error = validate(request.body);
    if (error) {
      return { status: 400, body: { error } };
    }

    const providerResult = await provider.charge({
      amount: request.body.amount,
      currency: request.body.currency.toUpperCase(),
      customerId: request.body.customerId
    });

    const result = {
      paymentId: providerResult.paymentId,
      status: providerResult.status
    };
    idemStore.set(key, result);

    return { status: 201, body: result, reused: false };
  };
}

module.exports = {
  createPaymentHandler
};

if (require.main === module) {
  const provider = {
    async charge() {
      return { paymentId: 'pmt-1', status: 'authorized' };
    }
  };

  const handle = createPaymentHandler(provider);
  const req = {
    headers: { 'idempotency-key': 'key-1' },
    body: { amount: 10, currency: 'usd', customerId: 'c-1' }
  };

  handle(req).then(console.log).then(() => handle(req).then(console.log));
}
