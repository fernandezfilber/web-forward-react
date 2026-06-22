const Redis = require('ioredis');

const redis = new Redis({
  host:           process.env.REDIS_HOST     || 'redis',
  port:           parseInt(process.env.REDIS_PORT || '6379'),
  password:       process.env.REDIS_PASSWORD || undefined,
  db:             parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => Math.min(times * 100, 3000),
  lazyConnect:    true,
});

redis.on('connect',  () => console.log('✅ Redis conectado'));
redis.on('error',    (err) => console.error('❌ Redis error:', err.message));

// ── Helpers ──────────────────────────────────────────────────

/**
 * Guarda refresh token en Redis con TTL de 7 días
 */
async function saveRefreshToken(userId, token) {
  const key = `refresh:${token}`;
  await redis.setex(key, 7 * 24 * 60 * 60, userId); // 7 days TTL
}

/**
 * Verifica si un refresh token es válido
 */
async function verifyRefreshToken(token) {
  const key = `refresh:${token}`;
  return await redis.get(key); // returns userId or null
}

/**
 * Revoca un refresh token
 */
async function revokeRefreshToken(token) {
  await redis.del(`refresh:${token}`);
}

/**
 * Revoca TODOS los tokens de un usuario (logout de todos los dispositivos)
 */
async function revokeAllUserTokens(userId) {
  // Uses a set to track tokens per user
  const members = await redis.smembers(`user_tokens:${userId}`);
  if (members.length) {
    const pipeline = redis.pipeline();
    members.forEach(token => pipeline.del(`refresh:${token}`));
    pipeline.del(`user_tokens:${userId}`);
    await pipeline.exec();
  }
}

/**
 * Cache helpers for gallery
 */
async function cacheGet(key) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

async function cacheSet(key, data, ttlSeconds = 300) {
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
}

async function cacheInvalidate(pattern) {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(...keys);
}

/**
 * Password Reset Helpers
 */
async function savePasswordResetCode(email, code) {
  const key = `pwd_reset:${email}`;
  // TTL of 15 minutes
  await redis.setex(key, 15 * 60, code);
}

async function verifyPasswordResetCode(email, code) {
  const key = `pwd_reset:${email}`;
  const storedCode = await redis.get(key);
  if (storedCode && storedCode === code) {
    await redis.del(key); // invalidate after successful use
    return true;
  }
  return false;
}

module.exports = {
  redis,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  cacheGet,
  cacheSet,
  cacheInvalidate,
  savePasswordResetCode,
  verifyPasswordResetCode,
};
