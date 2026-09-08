const Redis = require('ioredis');
const { redis_uri } = require('./config');

const redis = new Redis(redis_uri);

redis.on('connect', ()=> {
    console.log('Redis connected sucecssfully');
    
});

redis.on('error', (err)=> {
    console.error('Redis connection error', err);
    
});

module.exports = redis;