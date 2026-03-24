'use strict';

async function processEvents(events, handler) {
  // BUG: parallel processing breaks per-order sequencing.
  await Promise.all(events.map((event) => handler(event)));
}

module.exports = { processEvents };
