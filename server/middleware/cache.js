const CacheService = require('../services/cacheService');

/**
 * Middleware untuk validate cache
 * Cek apakah data ada di cache sebelum query database
 * @param {string} cacheKeyPrefix - Prefix untuk cache key
 * @param {number} ttl - Time to live dalam seconds
 * @returns {Function} Middleware function
 */
const validateCache = (cacheKeyPrefix, ttl = 3600) => {
    return async (req, res, next) => {
        try {
            // Generate simple cache key (konsisten tanpa query/body params)
            const cacheKey = cacheKeyPrefix;
            
            console.log(`🔍 Checking cache for: ${cacheKey}`);
            
            // Cek cache
            const cachedData = await CacheService.get(cacheKey);
            
            if (cachedData) {
                // Jika cache ada, return cached data
                console.log(`📦 Returning cached response for: ${cacheKeyPrefix} (${Array.isArray(cachedData) ? cachedData.length : 'object'} items)`);
                return res.json(cachedData);
            }
            
            console.log(`⚠️ Cache MISS for: ${cacheKey}, querying database...`);
            
            // Simpan cacheKey dan ttl ke req untuk digunakan di route handler
            req.cacheKey = cacheKey;
            req.cacheTTL = ttl;
            
            next();
        } catch (error) {
            console.error('Cache Validation Error:', error);
            next(); // Lanjut ke route handler jika ada error
        }
    };
};

/**
 * Middleware untuk invalidate cache
 * Hapus cache setelah data diupdate
 * @param {string|string[]} cachePatterns - Cache key patterns to invalidate
 * @returns {Function} Middleware function
 */
const invalidateCache = (cachePatterns) => {
    return async (req, res, next) => {
        try {
            // Simpan patterns ke request untuk digunakan setelah response
            req.invalidatePatterns = Array.isArray(cachePatterns) ? cachePatterns : [cachePatterns];
            
            // Tangkap original res.json untuk invalidate cache setelah response
            const originalJson = res.json.bind(res);
            res.json = function(data) {
                // Invalidate cache patterns
                (async () => {
                    for (const pattern of req.invalidatePatterns) {
                        await CacheService.invalidatePattern(pattern);
                    }
                })();
                
                return originalJson(data);
            };
            
            next();
        } catch (error) {
            console.error('Cache Invalidation Middleware Error:', error);
            next();
        }
    };
};

/**
 * Helper function untuk cache response di route handler
 * @param {object} res - Express response object
 * @param {any} data - Data to cache
 * @param {string} cacheKey - Cache key
 * @param {number} ttl - Time to live
 */
const setCacheResponse = async (res, data, cacheKey, ttl) => {
    try {
        await CacheService.set(cacheKey, data, ttl);
    } catch (error) {
        console.error('Error setting cache response:', error);
    }
};

module.exports = {
    validateCache,
    invalidateCache,
    setCacheResponse
};
