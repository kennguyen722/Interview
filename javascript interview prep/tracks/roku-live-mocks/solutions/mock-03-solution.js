'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function abortError() {
  const err = new Error('Operation aborted');
  err.name = 'AbortError';
  return err;
}

function assertNotAborted(signal) {
  if (signal && signal.aborted) {
    throw abortError();
  }
}

function isValidEvent(evt) {
  if (!evt || typeof evt !== 'object') return false;
  if (typeof evt.eventId !== 'string' || evt.eventId.trim() === '') return false;
  if (typeof evt.campaignId !== 'string' || evt.campaignId.trim() === '') return false;
  if (!['impression', 'click', 'conversion'].includes(evt.eventType)) return false;
  if (typeof evt.timestampMs !== 'number' || !Number.isFinite(evt.timestampMs)) return false;
  return true;
}

async function ingestTelemetry(readable, writeBatch, options = {}) {
  if (!readable || typeof readable[Symbol.asyncIterator] !== 'function') {
    throw new ValidationError('readable must be an async-iterable stream');
  }
  if (typeof writeBatch !== 'function') {
    throw new ValidationError('writeBatch must be a function');
  }

  const batchSize = Number.isInteger(options.batchSize) && options.batchSize > 0 ? options.batchSize : 100;
  const maxInvalidRatio = typeof options.maxInvalidRatio === 'number' && Number.isFinite(options.maxInvalidRatio)
    ? options.maxInvalidRatio
    : 0.05;
  const signal = options.signal;

  let buffer = '';
  let batch = [];

  let totalLines = 0;
  let validEvents = 0;
  let invalidEvents = 0;
  let batchesWritten = 0;

  async function flushBatch() {
    if (batch.length === 0) return;
    assertNotAborted(signal);
    await writeBatch(batch);
    batchesWritten += 1;
    batch = [];
  }

  function checkInvalidRatio() {
    if (totalLines >= 100 && invalidEvents / totalLines > maxInvalidRatio) {
      throw new ValidationError(
        `invalid ratio exceeded: ${invalidEvents}/${totalLines} > ${maxInvalidRatio}`
      );
    }
  }

  async function processLine(rawLine) {
    totalLines += 1;
    const line = rawLine.trim();

    if (line === '') {
      invalidEvents += 1;
      checkInvalidRatio();
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch (err) {
      invalidEvents += 1;
      checkInvalidRatio();
      return;
    }

    if (!isValidEvent(parsed)) {
      invalidEvents += 1;
      checkInvalidRatio();
      return;
    }

    validEvents += 1;
    batch.push(parsed);

    if (batch.length >= batchSize) {
      await flushBatch();
    }

    checkInvalidRatio();
  }

  assertNotAborted(signal);

  for await (const chunk of readable) {
    assertNotAborted(signal);

    buffer += String(chunk);
    let newlineIndex = buffer.indexOf('\n');

    while (newlineIndex !== -1) {
      assertNotAborted(signal);

      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      await processLine(line);

      newlineIndex = buffer.indexOf('\n');
    }
  }

  if (buffer.length > 0) {
    await processLine(buffer);
  }

  await flushBatch();

  return {
    totalLines,
    validEvents,
    invalidEvents,
    batchesWritten,
  };
}

module.exports = {
  ingestTelemetry,
  ValidationError,
};
