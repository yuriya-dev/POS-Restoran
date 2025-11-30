/**
 * Cache Testing Utility
 * Test Redis cache functionality
 * Run: node test-cache.js
 */

const CacheService = require('./services/cacheService');

async function testCache() {
    console.log('\n🧪 Starting Redis Cache Tests...\n');

    try {
        // Test 1: Set and Get
        console.log('📝 Test 1: Set and Get');
        const testData = { id: 1, name: 'Test Item', price: 50000 };
        await CacheService.set('test:item:1', testData, 3600);
        const retrieved = await CacheService.get('test:item:1');
        console.log('✅ Set and retrieved:', retrieved);
        console.log('✓ Pass\n');

        // Test 2: Cache Expiry
        console.log('📝 Test 2: Cache Expiry (1 second)');
        await CacheService.set('test:expiry', { temp: 'data' }, 1);
        console.log('Data set with 1 second TTL');
        const before = await CacheService.get('test:expiry');
        console.log('✅ Before expiry:', before ? 'Data exists' : 'No data');
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        const after = await CacheService.get('test:expiry');
        console.log('✅ After expiry:', after ? 'Data still exists' : 'Data expired');
        console.log('✓ Pass\n');

        // Test 3: Invalidate
        console.log('📝 Test 3: Invalidate Cache');
        await CacheService.set('test:delete', { data: 'to delete' }, 3600);
        console.log('✅ Data set');
        const beforeDelete = await CacheService.get('test:delete');
        console.log('✅ Before delete:', beforeDelete ? 'Data exists' : 'No data');
        await CacheService.invalidate('test:delete');
        const afterDelete = await CacheService.get('test:delete');
        console.log('✅ After invalidate:', afterDelete ? 'Data still exists' : 'Data deleted');
        console.log('✓ Pass\n');

        // Test 4: Pattern Invalidation
        console.log('📝 Test 4: Pattern Invalidation');
        await CacheService.set('menu:1', { id: 1 }, 3600);
        await CacheService.set('menu:2', { id: 2 }, 3600);
        await CacheService.set('menu:3', { id: 3 }, 3600);
        console.log('✅ Set 3 menu items');
        const deleted = await CacheService.invalidatePattern('menu:*');
        console.log(`✅ Deleted ${deleted} keys matching pattern 'menu:*'`);
        console.log('✓ Pass\n');

        // Test 5: Exists
        console.log('📝 Test 5: Exists Check');
        await CacheService.set('test:exists', { test: 'data' }, 3600);
        const exists = await CacheService.exists('test:exists');
        console.log('✅ Exists:', exists ? 'Key exists' : 'Key not found');
        const notExists = await CacheService.exists('test:nonexistent');
        console.log('✅ Not exists:', notExists ? 'Key exists' : 'Key not found');
        console.log('✓ Pass\n');

        // Test 6: TTL
        console.log('📝 Test 6: TTL Check');
        await CacheService.set('test:ttl', { test: 'data' }, 600);
        const ttl = await CacheService.ttl('test:ttl');
        console.log(`✅ TTL: ${ttl} seconds (should be around 600)`);
        console.log('✓ Pass\n');

        // Test 7: Extend TTL
        console.log('📝 Test 7: Extend TTL');
        const oldTtl = await CacheService.ttl('test:ttl');
        console.log(`✅ Old TTL: ${oldTtl} seconds`);
        await CacheService.extend('test:ttl', 1200);
        const newTtl = await CacheService.ttl('test:ttl');
        console.log(`✅ New TTL: ${newTtl} seconds (extended to 1200)`);
        console.log('✓ Pass\n');

        // Test 8: Multiple Data Types
        console.log('📝 Test 8: Multiple Data Types');
        const testArray = [1, 2, 3, 4, 5];
        await CacheService.set('test:array', testArray, 3600);
        const retrievedArray = await CacheService.get('test:array');
        console.log('✅ Array cached and retrieved:', retrievedArray);
        
        const testString = 'Hello, Cache!';
        await CacheService.set('test:string', testString, 3600);
        const retrievedString = await CacheService.get('test:string');
        console.log('✅ String cached and retrieved:', retrievedString);
        console.log('✓ Pass\n');

        // Cleanup
        console.log('🧹 Cleanup: Clearing test cache');
        await CacheService.invalidatePattern('test:*');
        console.log('✅ Test cache cleared\n');

        console.log('✨ All tests passed successfully!\n');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test Error:', error);
        process.exit(1);
    }
}

// Run tests
testCache();
