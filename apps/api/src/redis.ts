import Redis from 'ioredis';
import { REDIS_URL } from './config';

export const redisclient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});
