'use strict';

function customMap(items, mapper) {
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    out.push(mapper(items[i], i));
  }
  return out;
}

function customFilter(items, predicate) {
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    if (predicate(items[i], i)) {
      out.push(items[i]);
    }
  }
  return out;
}

function customReduce(items, reducer, initialValue) {
  let acc = initialValue;
  for (let i = 0; i < items.length; i += 1) {
    acc = reducer(acc, items[i], i);
  }
  return acc;
}

function compose(...fns) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

function sanitizeUserInput(input) {
  const trimmed = String(input).trim().replace(/\s+/g, ' ');
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  return trimmed;
}

module.exports = {
  customMap,
  customFilter,
  customReduce,
  compose,
  sanitizeUserInput
};

if (require.main === module) {
  const nums = [1, 2, 3, 4];
  console.log('map:', customMap(nums, (n) => n * 2));
  console.log('filter:', customFilter(nums, (n) => n % 2 === 0));
  console.log('reduce:', customReduce(nums, (a, n) => a + n, 0));
}
