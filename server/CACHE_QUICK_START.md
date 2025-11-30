## 🚀 Quick Start Cache Monitoring

Panduan cepat untuk menggunakan cache monitoring system.

### 1️⃣ Start Server dengan Cache Warming

```powershell
cd server
npm run dev
```

Expected output:
```
Server berjalan di port 5001
🚀 Redis initialized
🔥 Starting cache warming...
  📚 Warming categories cache...
  ✅ Cache SET: categories:all (TTL: 7200s)
  🪑 Warming tables cache...
  ✅ Cache SET: tables:all (TTL: 1800s)
  ⚙️ Warming settings cache...
  ✅ Cache SET: settings:all (TTL: 3600s)
✅ Cache warming completed!
```

### 2️⃣ Monitor Cache Performance

**Option A: Terminal Commands**

```powershell
# Check cache stats
curl http://localhost:5001/api/cache/stats | ConvertFrom-Json | Format-Table

# List all cache keys
curl http://localhost:5001/api/cache/keys

# Get specific cache key
curl http://localhost:5001/api/cache/categories:all
```

**Option B: Redis CLI**

```powershell
# Connect to Redis
redis-cli

# See all keys
KEYS *

# Check key TTL
TTL categories:all

# Monitor all commands
MONITOR
```

### 3️⃣ Read Logs for Cache Operations

Logs di terminal akan menunjukkan:

```
✅ Cache HIT: categories:all          ← Cache digunakan (CEPAT!)
⚠️ Cache MISS: orders:all             ← Database query (LAMBAT)
✅ Cache SET: orders:all (TTL: 300s)  ← Data disimpan ke cache
✅ Cache INVALIDATED: orders:*        ← Cache dihapus setelah update
```

### 4️⃣ Understanding Cache Responses

#### Cache HIT (Ideal)
```
GET /api/categories
│
├─ Cek Redis
├─ ✅ Data found di cache
├─ Return immediately
└─ Response time: ~2ms
```

#### Cache MISS (Need to Query DB)
```
GET /api/categories
│
├─ Cek Redis
├─ ⚠️ Data not found
├─ Query database
├─ Set to cache (3600s TTL)
└─ Response time: ~50-200ms
```

### 5️⃣ Cache Hit Ratio Interpretation

```json
{
  "hits": 245,
  "misses": 12,
  "hitRatio": "95.34%"
}
```

**Meaning:**
- Out of 257 requests, 245 dari cache (95.34%)
- Only 12 queries to database
- **Result**: 95.34% faster responses! 🚀

### 6️⃣ TTL (Time To Live) Monitoring

```json
{
  "key": "categories:all",
  "ttl": "7145s",
  "type": "string"
}
```

**Interpretation:**
- Data akan auto-delete dalam 7145 detik (~2 hours)
- Setelah itu, next request akan trigger database query
- Cache otomatis di-warm ulang jika expired

### 7️⃣ Manual Cache Operations

```powershell
# Delete specific key (force refresh)
curl -X DELETE http://localhost:5001/api/cache/categories:all

# Delete by pattern (multiple keys)
curl -X DELETE http://localhost:5001/api/cache/pattern/menu:*

# Clear all cache
curl -X DELETE http://localhost:5001/api/cache

# Warm cache manually
curl -X POST http://localhost:5001/api/cache/warm
```

### 8️⃣ Monitoring Dashboard Interpretation

```
┌─────────────────────────────────────────────┐
│ Cache Statistics                            │
├─────────────────────────────────────────────┤
│ Status:        connected ✅                 │
│ Keys Count:    42                           │
│ Cache Hits:    245                          │
│ Cache Misses:  12                           │
│ Hit Ratio:     95.34%                       │
│ Redis Memory:  2.5M                         │
│ Uptime:        2h 15m 30s                   │
└─────────────────────────────────────────────┘
```

**What's Good:**
- ✅ Status: connected
- ✅ Hit Ratio > 90%
- ✅ Keys Count increasing
- ✅ Memory usage reasonable

**What's Bad:**
- ❌ Status: disconnected
- ❌ Hit Ratio < 50%
- ❌ Memory > 100M
- ❌ No keys in cache

### 9️⃣ Common Patterns to Remember

```javascript
// Pattern 1: Invalidate related caches
POST /create menu item
├─ invalidateCache(['menu:*', 'categories:*'])
└─ Both menu and categories will refresh next time

// Pattern 2: TTL based refresh
GET /menu items
├─ Check cache first
├─ If HIT → return from cache
└─ If MISS → query DB, set cache, return

// Pattern 3: Automatic warming
Server starts
├─ Query categories → cache 7200s
├─ Query tables → cache 1800s
└─ Query settings → cache 3600s
```

### 🔟 Pro Tips

1. **Check cache before debugging database**
   - Hit ratio low? → Cache might not be warmed
   - Use `POST /api/cache/warm` to fix

2. **Adjust TTL based on data freshness**
   - Static data (categories): 2 hours ✅
   - Dynamic data (orders): 5 minutes ✅
   - Real-time data (kitchen): 1 minute ✅

3. **Use pattern invalidation**
   - `DELETE /pattern/menu:*` instead of individual keys
   - Faster and more reliable

4. **Monitor during peak hours**
   - See hit ratio when under load
   - Adjust if needed

5. **Keep Redis running**
   - Without Redis: system works but slower
   - With Redis: 10x faster response times

### 📊 Expected Performance Gains

**Before Caching:**
```
Response Time: 150ms
Database Queries: 1000/hour
Server Load: 80%
```

**After Caching with >90% Hit Ratio:**
```
Response Time: 10-20ms (7-15x faster!)
Database Queries: 100/hour (90% reduction!)
Server Load: 20%
```

### 🆘 Troubleshooting Quick Guide

| Problem | Check | Solution |
|---------|-------|----------|
| Cache MISS frequent | Hit ratio | Increase TTL or warm cache |
| Memory usage high | Keys info | Delete old keys or reduce TTL |
| Slow responses | Uptime | Restart Redis server |
| No cache keys | Monitor | Run `POST /api/cache/warm` |
| Redis disconnected | Status | Check Redis is running |

---

**Remember:** Cache is about SPEED. Monitor it regularly to keep your app fast! 🚀
