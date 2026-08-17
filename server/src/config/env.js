import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key',
};

export function validateEnv() {
  if (!env.MONGODB_URI) {
    console.error('FATAL: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }
}
