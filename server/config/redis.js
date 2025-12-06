const { Redis } = require('@upstash/redis');
require('dotenv').config();

let redis = null;

// Cek kredensial sebelum inisialisasi
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log("✅ Menginisialisasi Upstash Redis...");
    
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
} else {
    // Jangan error, cukup berikan peringatan dan jalan tanpa cache
    console.warn("⚠️ Upstash Redis Credentials tidak ditemukan. Cache akan non-aktif.");
    // Return null atau mock object agar aplikasi tidak crash
    redis = null;
}

module.exports = redis;