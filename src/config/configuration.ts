export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 4000,
  JWT: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  MONGO: {
    uri: process.env.MONGO_URI,
  },
  CACHE: {
    ttl: process.env.NEST_TTL_CACHE,
    storage: process.env.NEST_MAX_CACHE_STORAGE,
  },
});
