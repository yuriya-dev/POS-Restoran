## Cache Optimization & Monitoring Guide

Dokumentasi lengkap untuk sistem caching yang sudah dioptimalkan dengan monitoring real-time.

### 🔥 Cache Warming Otomatis

Setiap server startup, sistem secara otomatis pre-populate cache dengan data statis:

```
🔥 Starting cache warming...
  📚 Warming categories cache...
  ✅ Cache SET: categories:all (TTL: 7200s)
  🪑 Warming tables cache...
  ✅ Cache SET: tables:all (TTL: 1800s)
  ⚙️ Warming settings cache...
  ✅ Cache SET: settings:all (TTL: 3600s)
✅ Cache warming completed!
```

### 📊 Real-time Monitoring

#### Endpoint Monitoring

**GET /api/cache/stats** - Dapatkan statistik cache lengkap
```bash
curl http://localhost:5001/api/cache/stats
```

Response:
```json
{
  "status": "connected",
  "keys_count": 42,
  "timestamp": "2025-11-30T10:30:00Z",
  "monitor": {
    "hits": 245,
    "misses": 12,
    "sets": 58,
    "invalidations": 8,
    "hitRatio": "95.34%",
    "uptime": "2h 15m 30s",
    "redisInfo": {
      "usedMemory": "2.5M",
      "connectedClients": "5",
      "totalCommandsProcessed": "1250",
      "uptime": "8100s"
    },
    "totalKeys": 42,
    "keys": [...]
  }
}
```

**GET /api/cache/keys** - Lihat semua cache keys
```bash
curl http://localhost:5001/api/cache/keys
```

### 🎯 Cache Key Strategy

Cache keys dibuat dengan pattern konsisten untuk memudahkan invalidation:

```
categories:all          # 2 jam TTL
tables:all             # 30 menit TTL
settings:all           # 1 jam TTL
menu:all               # 1 jam TTL
orders:all             # 5 menit TTL
kitchen:active         # 1 menit TTL
```

### ⚡ Performance Improvements

#### Sebelum Cache Optimization:
- Cache MISS: `settings:all:{}:{}` - KEY TIDAK KONSISTEN
- Setiap request buat cache key baru
- Hit ratio rendah ~10%

#### Sesudah Cache Optimization:
```
✅ Cache HIT: categories:all
✅ Cache HIT: tables:all
✅ Cache HIT: settings:all
```
- Cache key konsisten
- Automatic pre-warming di startup
- Hit ratio meningkat ke 90%+

### 🔄 Cache Invalidation Strategy

#### Pattern-based Invalidation

Ketika data berubah, sistem otomatis invalidate related caches:

```javascript
// Create menu item → invalidate menu dan categories
invalidateCache(['menu:*', 'categories:*'])

// Update order → invalidate orders, kitchen, dan reports
invalidateCache(['orders:*', 'kitchen:*', 'reports:*'])

// Update table → invalidate tables dan detail
invalidateCache(['tables:*', 'tables:detail:*'])
```

#### Manual Invalidation

```bash
# Clear specific key
curl -X DELETE http://localhost:5001/api/cache/menu:all

# Clear by pattern
curl -X DELETE http://localhost:5001/api/cache/pattern/menu:*

# Clear all cache
curl -X DELETE http://localhost:5001/api/cache
```

### 📈 Hit Ratio Monitoring

Monitor cache performance via logs:

```
✅ Cache HIT: categories:all
✅ Cache HIT: tables:all
⚠️ Cache MISS: orders:all          ← Database query diperlukan
✅ Cache SET: orders:all (TTL: 300s)
✅ Cache HIT: orders:all           ← Cache digunakan next time
```

**Target Hit Ratio:**
- Static data (categories, tables, settings): 95%+
- Dynamic data (orders): 70%+
- Real-time (kitchen): 50%+ (by design)

### 🚀 Cache Warming Manual

Untuk pre-populate cache kapan saja:

```bash
curl -X POST http://localhost:5001/api/cache/warm
```

Response:
```json
{
  "status": "success",
  "message": "Cache warming completed"
}
```

### 📊 Cache Keys Information

**GET /api/cache/keys** menampilkan:
- Key name
- TTL (Time To Live) remaining
- Data type

```json
{
  "totalKeys": 42,
  "keys": [
    {
      "key": "categories:all",
      "ttl": "7145s",
      "type": "string"
    },
    {
      "key": "tables:all",
      "ttl": "1850s",
      "type": "string"
    },
    {
      "key": "orders:all",
      "ttl": "No expiry",
      "type": "string"
    }
  ]
}
```

### 🔧 Monitoring Metrics

Sistem melacak:
- **Hits**: Cache data found dan returned
- **Misses**: Cache data not found, query database
- **Sets**: Data stored to cache
- **Invalidations**: Cache keys deleted

```
Hits:          245 ✅
Misses:         12 ⚠️
Sets:           58 📝
Invalidations:   8 🗑️
Hit Ratio:   95.34%
```

### ⚙️ TTL Configuration

```javascript
// Static/Reference Data - Long TTL
categories:all      → 7200s (2 hours)
tables:all         → 1800s (30 minutes)
settings:all       → 3600s (1 hour)

// Semi-dynamic Data - Medium TTL
menu:all           → 3600s (1 hour)
reports:*          → 600s (10 minutes)

// Real-time Data - Short TTL
orders:*           → 300s (5 minutes)
kitchen:*          → 60s (1 minute)
```

### 🐛 Troubleshooting

#### Cache MISS berkali-kali?
- Periksa Redis connection: `redis-cli PING` → `PONG`
- Lihat server logs untuk error messages
- Gunakan `POST /api/cache/warm` untuk manual warming

#### Cache tidak ter-invalidate?
- Pastikan pattern invalidation benar: `DELETE /api/cache/pattern/orders:*`
- Lihat logs: `✅ Cache INVALIDATED PATTERN`

#### Performance tidak meningkat?
- Check hit ratio: `GET /api/cache/stats` → `hitRatio`
- Adjust TTL values jika needed
- Monitor database query times vs cache response times

### 📝 Production Best Practices

1. **Monitor Hit Ratio Regularly**
   - Target: 90%+ untuk static data
   - Adjust TTL jika hit ratio rendah

2. **Setup Cache Warming on Startup**
   - Automatic di server startup
   - Atau manual: `POST /api/cache/warm`

3. **Use Pattern-based Invalidation**
   - `DELETE /api/cache/pattern/menu:*` instead of individual keys
   - Cascading updates automatic

4. **Watch Memory Usage**
   - Monitor `usedMemory` dari stats
   - Adjust TTL atau cleanup old keys jika needed

5. **Log Cache Operations**
   - Enabled by default
   - Check logs untuk debugging

### 🎯 Next Steps

1. ✅ Start server dengan cache warming
2. ✅ Monitor cache stats: `GET /api/cache/stats`
3. ✅ Observe hit ratio improvement
4. ✅ Adjust TTL values based on metrics
5. ✅ Deploy to production dengan confidence
