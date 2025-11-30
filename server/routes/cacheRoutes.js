/**
 * @swagger
 * /api/cache:
 *   get:
 *     summary: Get cache statistics
 *     description: Retrieve current Redis cache statistics
 *     tags:
 *       - Cache Management
 *     responses:
 *       200:
 *         description: Cache statistics
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "connected"
 *             memory_used:
 *               type: string
 *               example: "1.5M"
 *             keys_count:
 *               type: number
 *               example: 42
 *   delete:
 *     summary: Clear all cache
 *     description: Flush all Redis cache data
 *     tags:
 *       - Cache Management
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *
 * /api/cache/{key}:
 *   get:
 *     summary: Get cached value by key
 *     description: Retrieve a specific cached value
 *     tags:
 *       - Cache Management
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: "menu:all"
 *     responses:
 *       200:
 *         description: Cached data
 *       404:
 *         description: Cache key not found
 *   delete:
 *     summary: Invalidate cache by key
 *     description: Delete a specific cache key
 *     tags:
 *       - Cache Management
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cache invalidated successfully
 *
 * /api/cache/pattern/{pattern}:
 *   delete:
 *     summary: Invalidate cache by pattern
 *     description: Delete multiple cache keys matching a pattern
 *     tags:
 *       - Cache Management
 *     parameters:
 *       - in: path
 *         name: pattern
 *         required: true
 *         schema:
 *           type: string
 *         example: "menu:*"
 *     responses:
 *       200:
 *         description: Cache pattern invalidated
 *         schema:
 *           type: object
 *           properties:
 *             deleted_count:
 *               type: number
 */

// Cache Management Routes
// These routes can be added to a new api/admin/cache route

const express = require('express');
const router = express.Router();
const CacheService = require('../services/cacheService');
const redisClient = require('../config/redis');

let cacheMonitor;
try {
    cacheMonitor = require('../utils/cacheMonitor');
} catch (e) {
    console.warn('Cache monitor not available');
}

/**
 * GET /api/cache/stats
 * Get cache statistics dan monitoring data
 */
router.get('/stats', async (req, res) => {
    try {
        const keys = await redisClient.keys('*');
        const info = await redisClient.info('stats');
        const memory = await redisClient.info('memory');
        
        let stats = {
            status: 'connected',
            keys_count: keys.length,
            timestamp: new Date().toISOString(),
            info: {
                stats: info,
                memory: memory
            }
        };

        // Add monitoring data if available
        if (cacheMonitor) {
            const monitorStats = await cacheMonitor.getStats();
            stats.monitor = monitorStats;
        }
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/cache/keys
 * Get semua cache keys dan TTL info
 */
router.get('/keys', async (req, res) => {
    try {
        if (!cacheMonitor) {
            return res.status(500).json({ error: 'Cache monitor not available' });
        }
        
        const keysInfo = await cacheMonitor.getKeysInfo();
        res.json({
            status: 'success',
            data: keysInfo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/cache/:key
 * Get specific cached value
 */
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const data = await CacheService.get(key);
        
        if (data) {
            res.json({ key, data, cached: true });
        } else {
            res.status(404).json({ key, message: 'Cache key not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/cache/:key
 * Delete specific cache key
 */
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const result = await CacheService.invalidate(key);
        
        res.json({
            key,
            invalidated: result,
            message: result ? 'Cache key deleted' : 'Cache key not found'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/cache/pattern/:pattern
 * Delete cache by pattern
 */
router.delete('/pattern/:pattern', async (req, res) => {
    try {
        const { pattern } = req.params;
        const deletedCount = await CacheService.invalidatePattern(pattern);
        
        res.json({
            pattern,
            deleted_count: deletedCount,
            message: `Deleted ${deletedCount} keys matching pattern`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/cache
 * Clear all cache
 */
router.delete('/', async (req, res) => {
    try {
        const result = await CacheService.clear();
        
        // Reset monitor if available
        if (cacheMonitor) {
            cacheMonitor.reset();
        }
        
        res.json({
            cleared: result,
            message: 'All cache cleared'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/cache/warm
 * Warm up cache dengan data statis
 */
router.post('/warm', async (req, res) => {
    try {
        const { warmCache } = require('../utils/cacheWarming');
        await warmCache();

        res.json({
            status: 'success',
            message: 'Cache warming completed'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message 
        });
    }
});

module.exports = router;
