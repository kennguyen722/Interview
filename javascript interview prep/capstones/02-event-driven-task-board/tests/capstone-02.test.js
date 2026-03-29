const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../solution/index');

test('capstone-02 emits lifecycle events and logs with correlationId', () => {
  const logs = [];
  const board = S.createTaskBoard({ logger: (entry) => logs.push(entry) });
  const seen = [];
  board.on('task.created', (e) => seen.push(e.type));

  const task = board.createTask({ title: 'Write tests' }, 'corr-1');
  board.updateTask(task.id, { title: 'Write more tests' }, 'corr-2');
  board.moveTask(task.id, 'done', 'corr-3');

  assert.deepEqual(seen, ['task.created']);
  assert.equal(board.listTasks()[0].status, 'done');
  assert.equal(logs.every((l) => typeof l.correlationId === 'string'), true);
});

test('capstone-02 supports snapshots and validation taxonomy', () => {
  const board = S.createTaskBoard();
  const created = board.createTask({ title: 'A' }, 'corr-1');
  const snap = board.snapshot();
  board.removeTask(created.id, 'corr-2');
  assert.equal(board.listTasks().length, 0);

  board.restore(snap);
  assert.equal(board.listTasks().length, 1);

  assert.throws(() => board.createTask({ title: '' }, 'corr-3'), /title is required/);
  assert.throws(() => board.updateTask('missing', { title: 'x' }, 'corr-4'), /task not found/);
});
