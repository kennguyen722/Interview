function encodeCursor(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
}

async function createUserWithAudit({ db, user }) {
  return db.transaction(async (tx) => {
    const created = await tx.users.insert(user);
    await tx.audit.insert({ type: 'USER_CREATED', userId: created.id });
    return created;
  });
}

async function listOrdersPage(db, { pageSize = 20, cursor = null }) {
  const params = [];
  let where = '';

  if (cursor) {
    const c = decodeCursor(cursor);
    params.push(c.createdAt, c.id);
    where = 'WHERE (created_at < $1 OR (created_at = $1 AND id < $2))';
  }

  params.push(pageSize + 1);

  const rows = await db.query(
    `SELECT id, created_at, total FROM orders ${where} ORDER BY created_at DESC, id DESC LIMIT $${params.length}`,
    params
  );

  const hasNext = rows.length > pageSize;
  const items = hasNext ? rows.slice(0, pageSize) : rows;
  const nextCursor = hasNext
    ? encodeCursor({ createdAt: items[items.length - 1].created_at, id: items[items.length - 1].id })
    : null;

  return { items, nextCursor };
}

module.exports = { createUserWithAudit, listOrdersPage };
