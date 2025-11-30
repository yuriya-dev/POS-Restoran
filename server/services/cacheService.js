const redisClient = require('../config/redis');

/**
 * Cache Service - Handle all caching operations
 * Includes validate and invalidate cache logic
 */

class CacheService {
    /**
     * Get data from cache
     * @param {string} key - Cache key
     * @returns {Promise<any>} Cached data or null
     */
    static async get(key) {
        try {
            const cachedData = await redisClient.get(key);
            if (cachedData) {
                console.log(`✅ Cache HIT: ${key}`);
                // Record hit in monitor
                try {
                    const monitor = require('../utils/cacheMonitor');
                    monitor.recordHit();
                } catch (e) {}
                return JSON.parse(cachedData);
            }
            console.log(`⚠️ Cache MISS: ${key}`);
            // Record miss in monitor
            try {
                const monitor = require('../utils/cacheMonitor');
                monitor.recordMiss();
            } catch (e) {}
            return null;
        } catch (error) {
            console.error(`❌ Cache GET Error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set data to cache with expiration
     * @param {string} key - Cache key
     * @param {any} value - Data to cache
     * @param {number} expiryInSeconds - TTL in seconds (default: 3600 = 1 hour)
     * @returns {Promise<boolean>}
     */
    static async set(key, value, expiryInSeconds = 3600) {
        try {
            await redisClient.setEx(key, expiryInSeconds, JSON.stringify(value));
            console.log(`✅ Cache SET: ${key} (TTL: ${expiryInSeconds}s)`);
            // Record set in monitor
            try {
                const monitor = require('../utils/cacheMonitor');
                monitor.recordSet();
            } catch (e) {}
            return true;
        } catch (error) {
            console.error(`❌ Cache SET Error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete specific cache key (Invalidate)
     * @param {string} key - Cache key to delete
     * @returns {Promise<boolean>}
     */
    static async invalidate(key) {
        try {
            const result = await redisClient.del(key);
            console.log(`✅ Cache INVALIDATED: ${key}`);
            // Record invalidation in monitor
            try {
                const monitor = require('../utils/cacheMonitor');
                monitor.recordInvalidation();
            } catch (e) {}
            return result > 0;
        } catch (error) {
            console.error(`❌ Cache INVALIDATE Error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Delete multiple cache keys by pattern (Invalidate many)
     * @param {string} pattern - Pattern to match keys (e.g., 'menu:*')
     * @returns {Promise<number>} Number of keys deleted
     */
    static async invalidatePattern(pattern) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length === 0) {
                console.log(`⚠️ No cache keys found matching pattern: ${pattern}`);
                return 0;
            }

            const deletedCount = await redisClient.del(keys);
            console.log(`✅ Cache INVALIDATED PATTERN: ${pattern} (${deletedCount} keys deleted)`);
            // Record invalidations in monitor
            try {
                const monitor = require('../utils/cacheMonitor');
                for (let i = 0; i < deletedCount; i++) {
                    monitor.recordInvalidation();
                }
            } catch (e) {}
            return deletedCount;
        } catch (error) {
            console.error(`❌ Cache INVALIDATE PATTERN Error for pattern ${pattern}:`, error);
            return 0;
        }
    }

    /**
     * Clear all cache
     * @returns {Promise<boolean>}
     */
    static async clear() {
        try {
            await redisClient.flushDb();
            console.log(`✅ Cache CLEARED: All keys deleted`);
            return true;
        } catch (error) {
            console.error(`❌ Cache CLEAR Error:`, error);
            return false;
        }
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {Promise<boolean>}
     */
    static async exists(key) {
        try {
            const result = await redisClient.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`❌ Cache EXISTS Error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Get cache expiry time
     * @param {string} key - Cache key
     * @returns {Promise<number>} TTL in seconds (-1 if no expiry, -2 if not exists)
     */
    static async ttl(key) {
        try {
            return await redisClient.ttl(key);
        } catch (error) {
            console.error(`❌ Cache TTL Error for key ${key}:`, error);
            return -2;
        }
    }

    /**
     * Extend cache expiry
     * @param {string} key - Cache key
     * @param {number} expiryInSeconds - New TTL in seconds
     * @returns {Promise<boolean>}
     */
    static async extend(key, expiryInSeconds = 3600) {
        try {
            const result = await redisClient.expire(key, expiryInSeconds);
            console.log(`✅ Cache TTL EXTENDED: ${key} (New TTL: ${expiryInSeconds}s)`);
            return result === 1;
        } catch (error) {
            console.error(`❌ Cache EXTEND Error for key ${key}:`, error);
            return false;
        }
    }
}

module.exports = CacheService;
