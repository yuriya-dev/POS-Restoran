const redis = require('redis');

// Create Redis client
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    database: process.env.REDIS_DB || 0,
});

// Handle connection events
client.on('connect', () => {
    console.log('✅ Redis Client Connected');
});

client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

client.on('ready', () => {
    console.log('✅ Redis Client Ready');
});

client.on('end', () => {
    console.log('⚠️ Redis Client Disconnected');
});

// Connect to Redis
client.connect().catch(err => {
    console.error('Failed to connect to Redis:', err);
});

module.exports = client;
