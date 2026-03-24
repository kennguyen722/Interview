'use strict';
// Module 17: Auth, Identity & Security Patterns — Reference Solution

const crypto = require('crypto');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function b64uEncode(str)  { return Buffer.from(str).toString('base64url'); }
function b64uDecode(str)  { return Buffer.from(str, 'base64url').toString('utf8'); }
function hmacSha256(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}
function secureId() {
  return crypto.randomBytes(32).toString('hex');
}

// ─── 1. JWT: sign / verify / decode ─────────────────────────────────────────
function jwtSign(payload, secret, { expiresInSec = 900 } = {}) {
  const header  = b64uEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = b64uEncode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSec,
    jti: secureId()
  }));
  const sig = hmacSha256(`${header}.${body}`, secret);
  return `${header}.${body}.${sig}`;
}

function jwtVerify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('invalid: malformed token');

  const [header, body, sig] = parts;
  const expectedSig = hmacSha256(`${header}.${body}`, secret);

  // Constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig)))
    throw new Error('invalid: signature mismatch');

  const payload = JSON.parse(b64uDecode(body));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000))
    throw new Error('expired');

  return payload;
}

function jwtDecode(token) {
  const [headerB64, bodyB64] = token.split('.');
  return {
    header:  JSON.parse(b64uDecode(headerB64)),
    payload: JSON.parse(b64uDecode(bodyB64))
  };
}

// ─── 2. Refresh Token Store with Rotation ────────────────────────────────────
function createRefreshTokenStore() {
  // token → { userId, used: boolean }
  const store = new Map();

  function issue(userId) {
    const token = secureId();
    store.set(token, { userId, used: false });
    return { refreshToken: token };
  }

  function rotate(oldToken) {
    const entry = store.get(oldToken);
    if (!entry || entry.used) {
      // Potential token theft — revoke all tokens for this user
      if (entry) {
        for (const [t, e] of store) {
          if (e.userId === entry.userId) store.delete(t);
        }
      }
      throw new Error('Invalid or reused refresh token — potential token theft');
    }
    entry.used = true;
    return issue(entry.userId);
  }

  function revoke(token) {
    store.delete(token);
  }

  function isValid(token) {
    const entry = store.get(token);
    return !!entry && !entry.used;
  }

  return { issue, rotate, revoke, isValid };
}

// ─── 3. RBAC Permission Checker ──────────────────────────────────────────────
function createRBAC({ roles }) {
  // Deep copy to avoid mutation of input
  const roleMap = new Map(
    Object.entries(roles).map(([role, perms]) => [role, new Set(perms)])
  );

  return {
    can(user, permission) {
      const perms = roleMap.get(user?.role);
      return !!perms?.has(permission);
    },
    assign(user, role) {
      if (!roleMap.has(role)) throw new Error(`Unknown role: ${role}`);
      return { ...user, role };
    },
    addPermission(role, permission) {
      if (!roleMap.has(role)) roleMap.set(role, new Set());
      roleMap.get(role).add(permission);
    },
    getPermissions(role) {
      return [...(roleMap.get(role) || [])];
    }
  };
}

// ─── 4. Session Store with Sliding TTL ───────────────────────────────────────
function createSessionStore({ ttlMs = 30 * 60 * 1000 } = {}) {
  const sessions = new Map();

  function create(data) {
    const id = secureId();
    sessions.set(id, { data: { ...data }, expiresAt: Date.now() + ttlMs });
    return id;
  }

  function get(id) {
    const session = sessions.get(id);
    if (!session) return null;
    if (Date.now() > session.expiresAt) { sessions.delete(id); return null; }
    // Sliding TTL: extend on access
    session.expiresAt = Date.now() + ttlMs;
    return { ...session.data };
  }

  function destroy(id) {
    sessions.delete(id);
  }

  function active() {
    const now = Date.now();
    let count = 0;
    for (const [id, s] of sessions) {
      if (s.expiresAt > now) count++;
      else sessions.delete(id);
    }
    return count;
  }

  return { create, get, destroy, active };
}

// ─── 5. Token Blacklist (Revocation) ─────────────────────────────────────────
function createTokenBlacklist() {
  // jti → expiresAtMs
  const blacklist = new Map();

  function revoke(jti, expiresAt) {
    blacklist.set(jti, expiresAt instanceof Date ? expiresAt.getTime() : Number(expiresAt) * 1000);
  }

  function isRevoked(jti) {
    const expiresAt = blacklist.get(jti);
    if (expiresAt === undefined) return false;
    if (Date.now() > expiresAt) { blacklist.delete(jti); return false; } // Auto-purge
    return true;
  }

  function purgeExpired() {
    const now = Date.now();
    for (const [jti, exp] of blacklist) {
      if (now > exp) blacklist.delete(jti);
    }
  }

  return { revoke, isRevoked, purgeExpired, size: () => blacklist.size };
}

// ─── 6. Auth Middleware Pipeline ─────────────────────────────────────────────
class AuthError extends Error {
  constructor(message, code) { super(message); this.name = 'AuthError'; this.code = code; }
}

function createAuthMiddleware({ jwtSecret, rbac, blacklist }) {
  return {
    authenticate(token) {
      if (!token) throw new AuthError('No token provided', 'MISSING_TOKEN');

      let payload;
      try {
        payload = jwtVerify(token, jwtSecret);
      } catch (e) {
        throw new AuthError(e.message.includes('expired') ? 'Token expired' : 'Invalid token',
          e.message.includes('expired') ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN');
      }

      if (blacklist?.isRevoked(payload.jti))
        throw new AuthError('Token has been revoked', 'TOKEN_REVOKED');

      return { userId: payload.sub, role: payload.role, jti: payload.jti };
    },

    authorize(user, requiredPermission) {
      if (!rbac.can(user, requiredPermission))
        throw new AuthError(
          `User role '${user.role}' cannot '${requiredPermission}'`,
          'FORBIDDEN'
        );
      return true;
    }
  };
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const SECRET = 'my-secret-key-never-hardcode-in-production';

  // JWT
  const token = jwtSign({ sub: 'u-1', role: 'admin' }, SECRET, { expiresInSec: 60 });
  const payload = jwtVerify(token, SECRET);
  console.log('JWT sub:', payload.sub, '| role:', payload.role);

  try { jwtVerify('tampered.token.value', SECRET); }
  catch (e) { console.log('JWT invalid:', e.message); }

  // Refresh token rotation
  const rtStore = createRefreshTokenStore();
  const { refreshToken: rt1 } = rtStore.issue('u-1');
  const { refreshToken: rt2 } = rtStore.rotate(rt1);
  console.log('Refresh rotated, rt1 valid:', rtStore.isValid(rt1), '(expect false)');
  console.log('rt2 valid:', rtStore.isValid(rt2), '(expect true)');

  // RBAC
  const rbac = createRBAC({
    roles: {
      admin:     ['orders:read', 'orders:write', 'users:read', 'users:write'],
      viewer:    ['orders:read'],
      moderator: ['orders:read', 'orders:write']
    }
  });
  const adminUser  = { id: 'u-1', role: 'admin' };
  const viewerUser = { id: 'u-2', role: 'viewer' };
  console.log('Admin can write orders:', rbac.can(adminUser, 'orders:write'));
  console.log('Viewer can write orders:', rbac.can(viewerUser, 'orders:write'));

  // Session Store
  const sessions = createSessionStore({ ttlMs: 5000 });
  const sid = sessions.create({ userId: 'u-1', role: 'admin' });
  console.log('Session data:', sessions.get(sid)?.userId);
  sessions.destroy(sid);
  console.log('After destroy:', sessions.get(sid));

  // Token Blacklist + Auth Middleware
  const blacklist = createTokenBlacklist();
  const auth = createAuthMiddleware({ jwtSecret: SECRET, rbac, blacklist });
  const t2 = jwtSign({ sub: 'u-2', role: 'viewer' }, SECRET, { expiresInSec: 60 });
  const user = auth.authenticate(t2);
  console.log('Auth user:', user.userId, user.role);
  try { auth.authorize(user, 'orders:write'); }
  catch (e) { console.log('Forbidden:', e.code); }
}

module.exports = { jwtSign, jwtVerify, jwtDecode, createRefreshTokenStore, createRBAC, createSessionStore, createTokenBlacklist, createAuthMiddleware, AuthError };
