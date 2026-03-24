'use strict';

async function cacheAsideGet(key, cache, store, ttlMs) {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const value = await store.get(key);
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
  return value;
}

function createInMemoryQueue(maxSize) {
  const queue = [];

  return {
    enqueue(item) {
      if (queue.length >= maxSize) {
        return false;
      }
      queue.push(item);
      return true;
    },
    dequeue() {
      return queue.shift() ?? null;
    },
    size() {
      return queue.length;
    }
  };
}

module.exports = {
  cacheAsideGet,
  createInMemoryQueue
};

if (require.main === module) {
  const queue = createInMemoryQueue(2);
  console.log(queue.enqueue(1), queue.enqueue(2), queue.enqueue(3));
}
