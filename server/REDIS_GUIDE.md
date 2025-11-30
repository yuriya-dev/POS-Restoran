# Redis Caching Implementation Guide

## Overview
Redis caching has been fully integrated into the POS Restoran server for improved performance and reduced database load.

## Setup Instructions

### 1. Install Redis Server

#### Windows (WSL2/WSL)
```bash
# If using WSL2
wsl
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start
```

#### macOS
```bash
brew install redis
brew services start redis
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
```

#### Docker
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

### 2. Environment Variables
Add to your `.env` file:
```env
# Redis Configuration (optional - will use defaults if not specified)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password  # if your Redis requires authentication
REDIS_DB=0  # database number to use
```

### 3. Verify Redis Connection
```bash
# In terminal
redis-cli

# In redis-cli prompt
127.0.0.1:6379> PING
PONG  # If you get PONG, Redis is running!
```

## Architecture

### Components

#### 1. **config/redis.js**
- Initializes Redis client connection
- Handles connection events (connect, error, ready, end)
- Auto-reconnects on connection loss

#### 2. **services/cacheService.js**
- Core caching service with CRUD operations:
  - `get(key)` - Retrieve cached data
  - `set(key, value, ttl)` - Store data with TTL
  - `invalidate(key)` - Delete specific cache
  - `invalidatePattern(pattern)` - Delete by pattern (e.g., 'menu:*')
  - `clear()` - Clear all cache
  - `exists(key)` - Check if key exists
  - `ttl(key)` - Get time-to-live
  - `extend(key, ttl)` - Extend cache expiry

#### 3. **middleware/cache.js**
- `validateCache(prefix, ttl)` - Middleware to check cache before query
- `invalidateCache(patterns)` - Middleware to invalidate cache after mutations
- `setCacheResponse(res, data, cacheKey, ttl)` - Helper to cache responses

## Cache Configuration by Endpoint

### Menu Routes (`/api/menu-items`)
- **GET /**: Cache `menu:all` - TTL: 1 hour
- **POST/PUT/DELETE**: Invalidates `menu:*` and `categories:*`

### Categories Routes (`/api/categories`)
- **GET /**: Cache `categories:all` - TTL: 2 hours
- **POST/PUT/DELETE**: Invalidates `categories:*` and `menu:*`

### Tables Routes (`/api/tables`)
- **GET /**: Cache `tables:all` - TTL: 30 minutes
- **POST/PUT/DELETE**: Invalidates `tables:*` and `tables:detail:*`

### Settings Routes (`/api/settings`)
- **GET /**: Cache `settings:all` - TTL: 1 hour
- **PUT**: Invalidates `settings:*`

### Orders Routes (`/api/orders`)
- **GET /**: Cache `orders:all` - TTL: 5 minutes (frequent updates)
- **GET /kitchen**: Cache `kitchen:orders` - TTL: 1 minute
- **POST/PUT/DELETE**: Invalidates `orders:*`, `kitchen:*`, `reports:*`

## Usage Examples

### In Controller
```javascript
const CacheService = require('../services/cacheService');

// Get data (with cache validation middleware)
router.get('/', validateCache('mydata:all', 3600), async (req, res) => {
    const data = await fetchFromDatabase();
    
    // Cache is automatically handled by middleware if available
    if (req.cacheKey) {
        await CacheService.set(req.cacheKey, data, req.cacheTTL);
    }
    
    res.json(data);
});

// Update data (with cache invalidation middleware)
router.put('/:id', invalidateCache('mydata:*'), async (req, res) => {
    const updated = await updateInDatabase(req.params.id, req.body);
    
    // Cache is automatically invalidated by middleware
    res.json(updated);
});
```

### Manual Cache Operations
```javascript
const CacheService = require('../services/cacheService');

// Get from cache
const cachedData = await CacheService.get('mykey');

// Set to cache
await CacheService.set('mykey', data, 3600); // 1 hour

// Invalidate single key
await CacheService.invalidate('mykey');

// Invalidate by pattern
await CacheService.invalidatePattern('menu:*');

// Check existence
const exists = await CacheService.exists('mykey');

// Get TTL
const ttl = await CacheService.ttl('mykey');

// Extend TTL
await CacheService.extend('mykey', 7200); // 2 hours

// Clear all cache
await CacheService.clear();
```

## Cache Key Naming Convention

```
<resource>:<action>:<filter>

Examples:
- menu:all
- menu:detail:123
- categories:all
- orders:active
- kitchen:orders
- reports:daily:2024-01-15
```

## Monitoring Cache

### Redis CLI Commands
```bash
# Connect to Redis
redis-cli

# Check all keys
KEYS *

# Check specific pattern
KEYS menu:*

# Get value
GET menu:all

# Get TTL
TTL menu:all

# Get memory usage
INFO memory

# Clear all
FLUSHALL

# Monitor in real-time
MONITOR
```

### Logging
The system logs all cache operations:
- ✅ Cache HIT: Data retrieved from cache
- ⚠️ Cache MISS: Data not in cache (will query DB)
- ✅ Cache SET: Data stored in cache
- ✅ Cache INVALIDATED: Cache cleared
- ❌ Errors: Any cache operation errors

## Performance Benefits

1. **Reduced Database Load**: Frequently accessed data cached in memory
2. **Faster Response Times**: Redis (in-memory) vs Database queries
3. **Better Scalability**: Distributed caching ready
4. **Cost Efficient**: Reduced database queries = lower costs

## TTL (Time-To-Live) Strategy

- **Static Data** (Settings, Categories): 1-2 hours
- **Semi-Dynamic Data** (Menu Items, Tables): 30 min - 1 hour
- **Real-Time Data** (Orders, Kitchen): 1-5 minutes
- **Cached User Data**: 30 minutes

## Fallback Behavior

If Redis is unavailable:
- Server logs warning but continues operating
- All requests go directly to database
- No data loss or errors
- Full backwards compatibility

## Troubleshooting

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**: Ensure Redis server is running
```bash
redis-cli PING  # Should return PONG
```

### Memory Issues
```bash
# Check Redis memory usage
redis-cli INFO memory

# Monitor keys
redis-cli KEYS * | wc -l

# Clear old cache if needed
redis-cli FLUSHALL
```

### Performance Degradation
- Check if cache is being invalidated too frequently
- Monitor cache hit/miss ratio in logs
- Adjust TTL values if needed
- Check Redis server resources (CPU, Memory)

## Best Practices

1. **Use Consistent Key Format**: Always follow `resource:action:filter` pattern
2. **Set Appropriate TTL**: Balance between freshness and performance
3. **Invalidate Smartly**: Use pattern matching for related data
4. **Monitor Cache**: Regularly check logs and cache statistics
5. **Handle Failures Gracefully**: System works even if Redis is down
6. **Test Invalidation**: Ensure related caches are invalidated together

## Security Notes

1. Set strong password if Redis is exposed to network
2. Use `REDIS_PASSWORD` in environment variables
3. Restrict Redis port (6379) in firewall
4. Consider Redis cluster for production
5. Enable AOF (Append-Only File) for persistence

## Next Steps

1. Test cache by monitoring logs
2. Adjust TTL values based on data freshness requirements
3. Set up Redis persistence (RDB/AOF)
4. Consider Redis Sentinel for high availability
5. Monitor performance metrics and cache statistics
