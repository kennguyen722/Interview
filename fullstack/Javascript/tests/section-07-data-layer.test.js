const test = require('node:test');
const assert = require('node:assert/strict');

async function createUserWithAudit({ db, user }) {
  return db.transaction(async (tx) => {
    const created = await tx.users.insert(user);
    await tx.audit.insert({ type: 'USER_CREATED', userId: created.id });
    return created;
  });
}

function tenantScopedRepo(db, tenantId) {
  return {
    findOrderById: (id) => db.oneOrNone(
      'SELECT * FROM orders WHERE id=$1 AND tenant_id=$2',
      [id, tenantId]
    ),
  };
}

async function runMigrations({ db, files }) {
  await db.query('CREATE TABLE IF NOT EXISTS migrations(name text primary key, applied_at timestamptz not null)');
  for (const file of files) {
    const applied = await db.oneOrNone('SELECT name FROM migrations WHERE name=$1', [file.name]);
    if (applied) continue;
    await db.transaction(async (tx) => {
      await tx.query(file.sql);
      await tx.query('INSERT INTO migrations(name, applied_at) VALUES($1, NOW())', [file.name]);
    });
  }
}

test('createUserWithAudit performs both writes in one transaction', async () => {
  const writes = [];
  const db = {
    transaction: async (fn) => fn({
      users: {
        insert: async (user) => {
          writes.push(['user', user]);
          return { id: 'u1', ...user };
        },
      },
      audit: {
        insert: async (event) => {
          writes.push(['audit', event]);
          return event;
        },
      },
    }),
  };

  const created = await createUserWithAudit({ db, user: { email: 'a@b.com' } });
  assert.equal(created.id, 'u1');
  assert.equal(writes.length, 2);
  assert.equal(writes[0][0], 'user');
  assert.equal(writes[1][0], 'audit');
});

test('tenantScopedRepo always sends tenant predicate', async () => {
  const captured = [];
  const db = {
    oneOrNone: async (sql, params) => {
      captured.push({ sql, params });
      return null;
    },
  };

  const repo = tenantScopedRepo(db, 'tenant-7');
  await repo.findOrderById('order-9');

  assert.equal(captured.length, 1);
  assert.match(captured[0].sql, /tenant_id/);
  assert.deepEqual(captured[0].params, ['order-9', 'tenant-7']);
});

test('runMigrations applies each migration once', async () => {
  const applied = new Set();
  const executedSql = [];

  const db = {
    query: async (sql) => {
      executedSql.push(sql);
    },
    oneOrNone: async (_sql, params) => {
      const name = params[0];
      return applied.has(name) ? { name } : null;
    },
    transaction: async (fn) => fn({
      query: async (sql, params) => {
        if (sql.startsWith('INSERT INTO migrations')) {
          applied.add(params[0]);
        }
        executedSql.push(sql);
      },
    }),
  };

  const files = [
    { name: '001_init', sql: 'CREATE TABLE t1(id int)' },
    { name: '002_add_index', sql: 'CREATE INDEX idx_t1_id ON t1(id)' },
  ];

  await runMigrations({ db, files });
  await runMigrations({ db, files });

  assert.equal(applied.size, 2);
  const inserts = executedSql.filter((s) => s.startsWith('INSERT INTO migrations'));
  assert.equal(inserts.length, 2);
});
