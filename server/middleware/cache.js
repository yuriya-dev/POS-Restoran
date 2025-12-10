const CacheService = require('../services/cacheService');

/**
 * Middleware untuk validate cache
 * Cek cache sebelum query database
 */
const validateCache = (cacheKeyPrefix, ttl = 3600) => {
    return async (req, res, next) => {
        try {
            const cacheKey = cacheKeyPrefix;

            console.log(`🔍 Checking cache for: ${cacheKey}`);

            // ✅ CacheService sudah null-safe
            const cachedData = await CacheService.get(cacheKey);

            if (cachedData !== null) {
                console.log(
                    `📦 Returning cached response for: ${cacheKey} (${Array.isArray(cachedData) ? cachedData.length : 'object'})`
                );
                return res.json(cachedData);
            }

            console.log(`⚠️ Cache MISS for: ${cacheKey}`);

            // Simpan metadata cache ke req untuk handler
            req.cacheKey = cacheKey;
            req.cacheTTL = ttl;

            next();
        } catch (error) {
            console.error('❌ Cache Validation Error:', error);
            next(); // fallback ke DB
        }
    };
};

/**
 * Middleware untuk invalidate cache
 */
const invalidateCache = (cachePatterns) => {
    return async (req, res, next) => {
        try {
            const patterns = Array.isArray(cachePatterns)
                ? cachePatterns
                : [cachePatterns];

            // Monkey-patch res.json
            const originalJson = res.json.bind(res);

            res.json = (data) => {
                // 🔥 Invalidate asynchronously (non-blocking)
                (async () => {
                    for (const pattern of patterns) {
                        await CacheService.invalidatePattern(pattern);
                    }
                })().catch(console.error);

                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('❌ Cache Invalidation Middleware Error:', error);
            next();
        }
    };
};

/**
 * Helper manual cache set
 */
const setCacheResponse = async (res, data, cacheKey, ttl) => {
    try {
        await CacheService.set(cacheKey, data, ttl);
    } catch (error) {
        console.error('❌ Error setting cache response:', error);
    }
};

module.exports = {
    validateCache,
    invalidateCache,
    setCacheResponse
};
