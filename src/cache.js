import cc from './consoleColors';
const cacheManager = require('cache-manager');
var redisStore = require('cache-manager-ioredis');
var Redis = require('ioredis');

var redisInstance = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379, // default value
  password: process.env.REDIS_PASSWD,
  db: Number(process.env.REDIS_DB) || 0,
});

const memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10/*seconds*/});
const redisCache = cacheManager.caching({
  store: redisStore,
  redisInstance: redisInstance,
  ttl: Number(process.env.REDIS_TTL) || 600
});

redisInstance.on('connect',()=>{
  console.log(`${cc.dim('[REDIS]')} connected`);
})
redisInstance.on('error', (error) => {
  // handle error here
  console.error(`${cc.red('[REDIS]')} ${error}`);
});

const multiCache = cacheManager.multiCaching([memoryCache, redisCache]);

export default multiCache;