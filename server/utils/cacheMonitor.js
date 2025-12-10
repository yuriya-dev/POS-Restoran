/**
 * Cache Monitoring Tool
 * Monitor cache performance dan statistics
 */

const CacheService = require('../services/cacheService');

class CacheMonitor {
    constructor() {
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            invalidations: 0,
            startTime: new Date(),
        };
    }

    /**
     * Get cache statistics
     */
    async getStats() {
        try {
            const info = await this.getCacheInfo();
            return {
                ...this.stats,
                hitRatio: this.stats.hits + this.stats.misses > 0 
                    ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2) + '%'
                    : 'N/A',
                uptime: this.getUptime(),
                redisInfo: info
            };
        } catch (error) {
            console.error('Error getting cache stats:', error);
            return this.stats;
        }
    }

    /**
     * Record cache hit
     */
    recordHit() {
        this.stats.hits++;
    }

    /**
     * Record cache miss
     */
    recordMiss() {
        this.stats.misses++;
    }

    /**
     * Record cache set
     */
    recordSet() {
        this.stats.sets++;
    }

    /**
     * Record cache invalidation
     */
    recordInvalidation() {
        this.stats.invalidations++;
    }

    /**
     * Get Redis info
     */
    async getCacheInfo() {
        try {
            const redisClient = require('../config/redis');
            if (!redisClient) return { status: 'Redis OFF' };

            // Upstash does NOT support INFO
            return {
                provider: 'Upstash',
                connection: 'HTTP REST',
                note: 'INFO command not available in Upstash'
            };
        } catch {
            return { status: 'Unavailable' };
        }
    }

    /**
     * Get cache keys info
     */
    async getKeysInfo() {
        try {
            const redisClient = require('../config/redis');
            if (!redisClient) return { totalKeys: 0, keys: [] };

            const keys = await redisClient.keys('*');

            const keysInfo = [];
            for (const key of keys) {
                const ttl = await redisClient.ttl(key);
                keysInfo.push({
                    key,
                    ttl: ttl === -1 ? 'No expiry' : `${ttl}s`
                });
            }

            return {
                totalKeys: keys.length,
                keys: keysInfo
            };
        } catch (error) {
            console.error('Error getting keys info:', error);
            return { totalKeys: 0, keys: [] };
        }
    }

    /**
     * Get uptime string
     */
    getUptime() {
        const now = new Date();
        const diff = now - this.stats.startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    }

    /**
     * Reset statistics
     */
    reset() {
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            invalidations: 0,
            startTime: new Date(),
        };
    }
}

// Singleton instance
const cacheMonitor = new CacheMonitor();

module.exports = cacheMonitor;
