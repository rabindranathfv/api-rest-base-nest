import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  PORT: Joi.number().default(3000),
  // MONGO_URI: Joi.string().required(),
  NEST_TTL_CACHE: Joi.string().required(),
  NEST_MAX_CACHE_STORAGE: Joi.string().required(),
});
