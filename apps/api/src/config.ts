import { config } from 'dotenv';
import { resolve } from 'path';

// const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';
const envFile = '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
export const FRONTEND_URL = process.env.FRONTEND_URL || '';
export const REDIS_URL = process.env.REDIS_URL || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const SMTP_USER = process.env.SMTP_USER || '';
