const { Redis } = require('@upstash/redis');
require('dotenv').config();

let redisClient = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  console.log('✅ Menginisialisasi Upstash Redis...');

  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  });
} else {
  console.warn(
    '⚠️ Upstash Redis credentials tidak ditemukan. Cache dinonaktifkan.'
  );
}

module.exports = redisClient;
