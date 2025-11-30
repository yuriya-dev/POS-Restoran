/**
 * Cache Warming Utility
 * Pre-populate cache dengan data statis saat server startup
 */

const CacheService = require('../services/cacheService');
const { getAllCategories } = require('../controllers/categoryController');
const { getAllTables } = require('../controllers/tableController');
const { getSettings } = require('../controllers/settingsController');

/**
 * Warm up cache dengan data statis
 */
async function warmCache() {
    try {
        console.log('🔥 Starting cache warming...');

        // Simulasi request object untuk controller functions
        const mockReq = {};
        const mockRes = {
            json: (data) => data,
            status: () => mockRes
        };

        // 1. Warm Categories Cache
        try {
            console.log('  📚 Warming categories cache...');
            const categoriesData = await getCategoriesData();
            if (categoriesData) {
                await CacheService.set('categories:all', categoriesData, 7200); // 2 hours
            }
        } catch (error) {
            console.warn('  ⚠️ Failed to warm categories cache:', error.message);
        }

        // 2. Warm Tables Cache
        try {
            console.log('  🪑 Warming tables cache...');
            const tablesData = await getTablesData();
            if (tablesData) {
                await CacheService.set('tables:all', tablesData, 1800); // 30 minutes
            }
        } catch (error) {
            console.warn('  ⚠️ Failed to warm tables cache:', error.message);
        }

        // 3. Warm Settings Cache
        try {
            console.log('  ⚙️ Warming settings cache...');
            const settingsData = await getSettingsData();
            if (settingsData) {
                await CacheService.set('settings:all', settingsData, 3600); // 1 hour
            }
        } catch (error) {
            console.warn('  ⚠️ Failed to warm settings cache:', error.message);
        }

        console.log('✅ Cache warming completed!');
    } catch (error) {
        console.error('❌ Cache warming failed:', error);
    }
}

/**
 * Get categories data from database
 */
async function getCategoriesData() {
    try {
        const supabase = require('../config/supabase');
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data; // Return array directly
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
}

/**
 * Get tables data from database
 */
async function getTablesData() {
    try {
        const supabase = require('../config/supabase');
        const { data, error } = await supabase
            .from('dining_tables')
            .select('*')
            .order('table_id');

        if (error) throw error;
        return data; // Return array directly
    } catch (error) {
        console.error('Error fetching tables:', error);
        return null;
    }
}

/**
 * Get settings data from database
 */
async function getSettingsData() {
    try {
        const supabase = require('../config/supabase');
        const { data, error } = await supabase
            .from('settings')
            .select('*');

        if (error) throw error;
        return data; // Return array directly
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

module.exports = { warmCache };
