'use strict';
// Module 16: Database & Data Layer Engineering — Reference Solution

// ─── 1. In-Memory Repository ─────────────────────────────────────────────────
function createRepository() {
  const store = new Map();

  return {
    save(entity) {
      if (!entity?.id) throw new Error('Entity must have an id');
      store.set(String(entity.id), { ...entity });
      return { ...entity };
    },
    findById(id) {
      const e = store.get(String(id));
      return e ? { ...e } : null;
    },
    findAll() {
      return [...store.values()].map(e => ({ ...e }));
    },
    findWhere(predicate) {
      return [...store.values()].filter(predicate).map(e => ({ ...e }));
    },
    delete(id) {
      return store.delete(String(id));
    },
    count() { return store.size; }
  };
}

// ─── 2. Unit of Work ─────────────────────────────────────────────────────────
function createUnitOfWork(repository) {
  const newEntities    = new Map();
  const dirtyEntities  = new Map();
  const deletedIds     = new Set();

  return {
    registerNew(entity) {
      if (!entity?.id) throw new Error('Entity must have an id');
      newEntities.set(String(entity.id), entity);
    },
    registerDirty(entity) {
      if (!entity?.id) throw new Error('Entity must have an id');
      if (!deletedIds.has(String(entity.id)))
        dirtyEntities.set(String(entity.id), entity);
    },
    registerDeleted(id) {
      const key = String(id);
      newEntities.delete(key);
      dirtyEntities.delete(key);
      deletedIds.add(key);
    },
    commit() {
      let inserted = 0, updated = 0, deleted = 0;
      for (const entity of newEntities.values())   { repository.save(entity); inserted++; }
      for (const entity of dirtyEntities.values())  { repository.save(entity); updated++; }
      for (const id of deletedIds)                  { repository.delete(id);   deleted++; }
      this.rollback();
      return { inserted, updated, deleted };
    },
    rollback() {
      newEntities.clear();
      dirtyEntities.clear();
      deletedIds.clear();
    },
    pending() {
      return { inserts: newEntities.size, updates: dirtyEntities.size, deletes: deletedIds.size };
    }
  };
}

// ─── 3. Query Builder ────────────────────────────────────────────────────────
function createQueryBuilder() {
  let _table   = '';
  let _columns = ['*'];
  let _wheres  = [];
  let _orderBy = null;
  let _limit   = null;
  let _offset  = null;

  const builder = {
    from(table)       { _table = table;               return builder; },
    select(...cols)   { _columns = cols.length ? cols : ['*']; return builder; },
    where(col, op, val) { _wheres.push({ col, op, val }); return builder; },
    orderBy(col, dir) { _orderBy = { col, dir: dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' }; return builder; },
    limit(n)          { _limit = n;                   return builder; },
    offset(n)         { _offset = n;                  return builder; },

    build() {
      if (!_table) throw new Error('Table must be specified');
      const params = [];
      let sql = `SELECT ${_columns.join(', ')} FROM ${_table}`;

      if (_wheres.length > 0) {
        const whereClauses = _wheres.map(({ col, op, val }) => {
          params.push(val);
          return `${col} ${op} ?`;
        });
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      if (_orderBy) sql += ` ORDER BY ${_orderBy.col} ${_orderBy.dir}`;
      if (_limit !== null) sql += ` LIMIT ${_limit}`;
      if (_offset !== null) sql += ` OFFSET ${_offset}`;

      return { sql, params };
    },

    reset() {
      _table = ''; _columns = ['*']; _wheres = [];
      _orderBy = null; _limit = null; _offset = null;
      return builder;
    }
  };

  return builder;
}

// ─── 4. Connection Pool ───────────────────────────────────────────────────────
function createConnectionPool({ size, createConnection, destroyConnection }) {
  const idle = [];
  const waitQueue = [];
  let totalCreated = 0;

  // Pre-create connections
  for (let i = 0; i < size; i++) {
    idle.push(createConnection(i));
    totalCreated++;
  }

  function acquire({ timeoutMs } = {}) {
    if (idle.length > 0) return Promise.resolve(idle.pop());

    return new Promise((resolve, reject) => {
      let timer = null;

      const waiter = { resolve, reject };
      waitQueue.push(waiter);

      if (timeoutMs != null) {
        timer = setTimeout(() => {
          const idx = waitQueue.indexOf(waiter);
          if (idx !== -1) waitQueue.splice(idx, 1);
          reject(new Error(`Connection pool acquire timeout after ${timeoutMs}ms`));
        }, timeoutMs);
        // Attach timer to waiter for cleanup
        waiter.timer = timer;
      }
    });
  }

  function release(connection) {
    if (waitQueue.length > 0) {
      const waiter = waitQueue.shift();
      if (waiter.timer) clearTimeout(waiter.timer);
      waiter.resolve(connection);
    } else {
      idle.push(connection);
    }
  }

  function destroy() {
    for (const conn of idle) destroyConnection(conn);
    idle.length = 0;
  }

  return { acquire, release, destroy, idleCount: () => idle.size, pendingCount: () => waitQueue.length };
}

// ─── 5. Migration Runner ─────────────────────────────────────────────────────
function createMigrationRunner(db) {
  const migrations = new Map(); // version → { name, up, down }

  function register({ version, name, up, down }) {
    migrations.set(version, { name, up, down });
  }

  async function migrate() {
    const applied = new Set(db.appliedMigrations || []);
    const pending = [...migrations.entries()]
      .filter(([v]) => !applied.has(v))
      .sort(([a], [b]) => a - b);

    for (const [version, { name, up }] of pending) {
      await up(db);
      if (!db.appliedMigrations) db.appliedMigrations = [];
      db.appliedMigrations.push(version);
    }

    return { ran: pending.map(([v, { name }]) => ({ version: v, name })) };
  }

  async function rollback(targetVersion) {
    const applied = (db.appliedMigrations || []).slice().sort((a, b) => b - a);
    const toRollback = applied.filter(v => v > targetVersion);

    for (const version of toRollback) {
      const m = migrations.get(version);
      if (m?.down) await m.down(db);
      db.appliedMigrations = db.appliedMigrations.filter(v => v !== version);
    }

    return { rolledBack: toRollback };
  }

  function getApplied() {
    return [...(db.appliedMigrations || [])].sort((a, b) => a - b);
  }

  return { register, migrate, rollback, getApplied };
}

// ─── 6. Eager Loader (N+1 Prevention) ────────────────────────────────────────
function createEagerLoader(db) {
  return {
    async loadUsersWithOrders(userIds) {
      // Two queries instead of N+1
      const [users, orders] = await Promise.all([
        db.getUsers(userIds),
        db.getOrdersByUserIds(userIds)
      ]);

      // Group orders by userId
      const ordersByUser = new Map();
      for (const order of orders) {
        const uid = String(order.userId);
        if (!ordersByUser.has(uid)) ordersByUser.set(uid, []);
        ordersByUser.get(uid).push(order);
      }

      return users.map(user => ({
        ...user,
        orders: ordersByUser.get(String(user.id)) || []
      }));
    }
  };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  // Repository
  const repo = createRepository();
  repo.save({ id: '1', name: 'Alice', role: 'admin' });
  repo.save({ id: '2', name: 'Bob',   role: 'user' });
  const admins = repo.findWhere(u => u.role === 'admin');
  console.log('Admins:', admins.map(u => u.name));

  // Unit of Work
  const uow = createUnitOfWork(repo);
  uow.registerNew({ id: '3', name: 'Charlie', role: 'user' });
  uow.registerDirty({ id: '1', name: 'Alice Updated', role: 'admin' });
  const summary = uow.commit();
  console.log('UoW commit:', summary); // { inserted: 1, updated: 1, deleted: 0 }

  // Query Builder
  const qb = createQueryBuilder();
  const { sql, params } = qb.from('users').select('id', 'name').where('role', '=', 'admin').orderBy('name').limit(10).build();
  console.log('Query:', sql, '| params:', params);

  // Connection Pool
  let connId = 0;
  const pool = createConnectionPool({ size: 2, createConnection: () => ({ id: connId++ }), destroyConnection: () => {} });
  (async () => {
    const c1 = await pool.acquire();
    const c2 = await pool.acquire();
    console.log('Pool connections:', c1.id, c2.id);
    pool.release(c1);
    const c3 = await pool.acquire({ timeoutMs: 1000 });
    console.log('Reused connection id:', c3.id);
    pool.release(c2); pool.release(c3);
  })();

  // Migration Runner
  (async () => {
    const db = {};
    const runner = createMigrationRunner(db);
    runner.register({ version: 1, name: 'Create users table', up: async (db) => { db.users = true; }, down: async (db) => { delete db.users; } });
    runner.register({ version: 2, name: 'Add email column',   up: async (db) => { db.email  = true; }, down: async (db) => { delete db.email; } });
    const result = await runner.migrate();
    console.log('Migrations ran:', result.ran.map(m => m.name));
    console.log('Applied:', runner.getApplied());
  })();

  // Eager Loader
  (async () => {
    const mockDb = {
      getUsers:             async ids => ids.map(id => ({ id, name: `User ${id}` })),
      getOrdersByUserIds:   async ids => {
        const orders = [];
        for (const uid of ids) orders.push({ id: `o-${uid}-1`, userId: uid }, { id: `o-${uid}-2`, userId: uid });
        return orders;
      }
    };
    const loader = createEagerLoader(mockDb);
    const users  = await loader.loadUsersWithOrders(['u1', 'u2']);
    console.log('Eager loaded:', users[0].name, 'orders:', users[0].orders.length);
  })();
}

module.exports = { createRepository, createUnitOfWork, createQueryBuilder, createConnectionPool, createMigrationRunner, createEagerLoader };
