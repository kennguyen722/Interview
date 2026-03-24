const test = require('node:test');
const assert = require('node:assert/strict');

async function findUserByEmail(db, email) {
  return db.oneOrNone('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
}

function verifyJwtHeader(header, keyStore) {
  const key = keyStore.get(header.kid);
  if (!key) throw new Error('UNKNOWN_KID');
  return key;
}

function verifyCsrf(req, res, next) {
  const csrfCookie = req.cookies.csrf;
  const csrfHeader = req.headers['x-csrf-token'];
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    res.status(403).json({ error: 'CSRF_INVALID' });
    return;
  }
  next();
}

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('findUserByEmail uses parameterized query', async () => {
  const calls = [];
  const db = {
    oneOrNone: async (sql, params) => {
      calls.push({ sql, params });
      return { id: 'u1', email: params[0] };
    },
  };

  const email = "x' OR 1=1 --";
  const out = await findUserByEmail(db, email);

  assert.equal(out.email, email);
  assert.match(calls[0].sql, /WHERE email = \$1/);
  assert.deepEqual(calls[0].params, [email]);
});

test('verifyJwtHeader resolves known kid and rejects unknown', () => {
  const keyStore = new Map([['kid-1', 'secret1']]);
  assert.equal(verifyJwtHeader({ kid: 'kid-1' }, keyStore), 'secret1');
  assert.throws(() => verifyJwtHeader({ kid: 'kid-x' }, keyStore), /UNKNOWN_KID/);
});

test('verifyCsrf allows matching token and blocks mismatch', () => {
  const nextCalls = { n: 0 };
  const next = () => {
    nextCalls.n += 1;
  };

  const reqGood = {
    cookies: { csrf: 'abc' },
    headers: { 'x-csrf-token': 'abc' },
  };
  const resGood = createMockRes();
  verifyCsrf(reqGood, resGood, next);
  assert.equal(nextCalls.n, 1);

  const reqBad = {
    cookies: { csrf: 'abc' },
    headers: { 'x-csrf-token': 'zzz' },
  };
  const resBad = createMockRes();
  verifyCsrf(reqBad, resBad, next);
  assert.equal(resBad.statusCode, 403);
  assert.deepEqual(resBad.body, { error: 'CSRF_INVALID' });
});
