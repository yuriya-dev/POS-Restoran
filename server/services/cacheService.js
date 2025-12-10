const redisClient = require('../config/redis');

function isRedisAvailable() {
  return redisClient && typeof redisClient.get === 'function';
}

class CacheService {
  static async get(key) {
    if (!isRedisAvailable()) {
      console.warn(`⚠️ Redis OFF - skip GET: ${key}`);
      return null;
    }

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`✅ Cache HIT: ${key}`);
        return JSON.parse(cachedData);
      }

      console.log(`⚠️ Cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error(`❌ Cache GET Error (${key}):`, error);
      return null;
    }
  }

    static async set(key, value, expiryInSeconds = 3600) {
        if (!isRedisAvailable()) return false;

        try {
            await redisClient.set(
                key,
                JSON.stringify(value),
                { ex: expiryInSeconds }
            );
            console.log(`✅ Cache SET: ${key} (${expiryInSeconds}s)`);
            return true;
        } catch (error) {
            console.error(`❌ Cache SET Error (${key}):`, error);
            return false;
        }
    }

  static async invalidate(key) {
    if (!isRedisAvailable()) return false;

    try {
      const deleted = await redisClient.del(key);
      console.log(`✅ Cache INVALIDATED: ${key}`);
      return deleted > 0;
    } catch (error) {
      console.error(`❌ Cache INVALIDATE Error (${key}):`, error);
      return false;
    }
  }

  static async invalidatePattern(pattern) {
    if (!isRedisAvailable()) return 0;

    try {
      const keys = await redisClient.keys(pattern);
      if (!keys.length) {
        console.log(`⚠️ No cache key matching: ${pattern}`);
        return 0;
      }

      const deleted = await redisClient.del(keys);
      console.log(`✅ Cache INVALIDATED PATTERN: ${pattern}`);
      return deleted;
    } catch (error) {
      console.error(
        `❌ Cache INVALIDATE PATTERN Error (${pattern}):`,
        error
      );
      return 0;
    }
  }

  static async clear() {
    if (!isRedisAvailable()) return false;

    try {
      await redisClient.flushDb();
      console.log('✅ Cache CLEARED');
      return true;
    } catch (error) {
      console.error('❌ Cache CLEAR Error:', error);
      return false;
    }
  }

  static async exists(key) {
    if (!isRedisAvailable()) return false;

    try {
      return (await redisClient.exists(key)) === 1;
    } catch (error) {
      console.error(`❌ Cache EXISTS Error (${key}):`, error);
      return false;
    }
  }

  static async ttl(key) {
    if (!isRedisAvailable()) return -2;

    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error(`❌ Cache TTL Error (${key}):`, error);
      return -2;
    }
  }

  static async extend(key, expiryInSeconds = 3600) {
    if (!isRedisAvailable()) return false;

    try {
      const result = await redisClient.expire(key, expiryInSeconds);
      console.log(`✅ TTL EXTENDED: ${key}`);
      return result === 1;
    } catch (error) {
      console.error(`❌ Cache EXTEND Error (${key}):`, error);
      return false;
    }
  }
}

module.exports = CacheService;