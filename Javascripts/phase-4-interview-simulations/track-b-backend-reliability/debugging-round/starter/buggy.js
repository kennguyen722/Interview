'use strict';

async function retryForever(task) {
  while (true) {
    try {
      return await task();
    } catch (error) {
      // BUG: no cap, no delay, immediate hammering.
    }
  }
}

module.exports = { retryForever };
