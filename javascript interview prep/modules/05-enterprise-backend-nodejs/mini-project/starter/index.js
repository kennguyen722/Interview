function createIdempotencyStore() {
  throw new Error('TODO: implement createIdempotencyStore');
}

function createOrderService(_store) {
  throw new Error('TODO: implement createOrderService');
}

function encodeCursor(_payload) {
  throw new Error('TODO: implement encodeCursor');
}

function decodeCursor(_cursor) {
  throw new Error('TODO: implement decodeCursor');
}

function paginateOrders(_rows, _pageSize, _cursor) {
  throw new Error('TODO: implement paginateOrders');
}

function createTenantRateLimiter(_opts) {
  throw new Error('TODO: implement createTenantRateLimiter');
}

module.exports = {
  createIdempotencyStore,
  createOrderService,
  encodeCursor,
  decodeCursor,
  paginateOrders,
  createTenantRateLimiter,
};
