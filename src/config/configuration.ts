export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 4000,
  JWT: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  // MONGO: {
  //   uri: process.env.MONGO_URI,
  // },
  CACHE: {
    ttl: process.env.TTL_CACHE,
    storage: process.env.MAX_CACHE_STORAGE,
  },
  REDIS: {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
  },
});
