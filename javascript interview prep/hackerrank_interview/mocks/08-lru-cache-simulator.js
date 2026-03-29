'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  const lines = input.trim().split(/\r?\n/);
  let idx = 0;
  const capacity = Number(lines[idx++]);
  const q = Number(lines[idx++]);

  const cache = new LRUCache(capacity);
  const out = [];

  for (let i = 0; i < q; i += 1) {
    const parts = (lines[idx++] || '').trim().split(/\s+/);
    const cmd = parts[0];
    if (cmd === 'PUT') {
      cache.put(parts[1], Number(parts[2]));
    } else if (cmd === 'GET') {
      out.push(String(cache.get(parts[1])));
    }
  }

  process.stdout.write(out.join('\n') + (out.length ? '\n' : ''));
});

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
  }
}

module.exports = { LRUCache };
