import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
  },
  postgres: {
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'access secret',
    accessTokenExpiration: parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION) || 3600,
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh secret',
    refreshTokenExpiration: parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION) || 86400,
  },
});
