/**
 * API Response Cache Service
 * Implementasi caching strategy untuk mengurangi network requests
 * TTL (Time To Live) berbeda untuk setiap endpoint
 */

class CacheService {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }

    /**
     * Get cached data jika tersedia dan masih valid
     */
    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        // Cek apakah data sudah kadaluarsa
        if (Date.now() > cached.expiry) {
            this.cache.delete(key);
            this.timers.delete(key);
            return null;
        }
        
        return cached.data;
    }

    /**
     * Set cache dengan TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds (default: 5 min)
     */
    set(key, data, ttl = 5 * 60 * 1000) {
        // Clear existing timer
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl
        });

        // Auto-cleanup setelah TTL
        const timer = setTimeout(() => {
            this.cache.delete(key);
            this.timers.delete(key);
        }, ttl);

        this.timers.set(key, timer);
    }

    /**
     * Invalidate specific cache
     */
    invalidate(key) {
        this.cache.delete(key);
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
    }

    /**
     * Invalidate multiple caches by pattern
     * Useful untuk invalidate related data
     */
    invalidatePattern(pattern) {
        const regex = new RegExp(pattern);
        const keysToDelete = Array.from(this.cache.keys()).filter(key => regex.test(key));
        keysToDelete.forEach(key => this.invalidate(key));
    }

    /**
     * Clear all cache
     */
    clearAll() {
        this.cache.forEach((_, key) => this.invalidate(key));
    }

    /**
     * Get cache stats (debug)
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

export const cacheService = new CacheService();

/**
 * TTL Configuration per endpoint
 * Sesuaikan berdasarkan frequency perubahan data
 */
export const CACHE_TTL = {
    // Settings: jarang berubah, cache 30 menit
    SETTINGS: 30 * 60 * 1000,
    
    // Categories & Menu: update 5 menit
    CATEGORIES: 5 * 60 * 1000,
    MENU_ITEMS: 5 * 60 * 1000,
    
    // Tables: update cepat, cache 1 menit
    TABLES: 1 * 60 * 1000,
    
    // Users/Employees: jarang update, cache 10 menit
    USERS: 10 * 60 * 1000,
    
    // Orders: frequently updated, cache 30 detik
    ORDERS: 30 * 1000,
    
    // Reports: aggregate data, cache 2 menit
    REPORTS: 2 * 60 * 1000,
    
    // Top Selling Items: cache 5 menit
    TOP_SELLING: 5 * 60 * 1000,
    
    // Shifts: cache 2 menit
    SHIFTS: 2 * 60 * 1000
};
