import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const requiredEnv = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: requiredEnv('MONGO_URI'),
  JWT_SECRET: requiredEnv('JWT_SECRET'),
  CLIENT_URL: process.env.CLIENT_URL?.trim() || 'https://nail-shop-phi.vercel.app',
  ADMIN_EMAIL: requiredEnv('ADMIN_EMAIL').toLowerCase(),
  ADMIN_PASSWORD: requiredEnv('ADMIN_PASSWORD'),
  ADMIN_NAME: process.env.ADMIN_NAME?.trim() || 'Admin',
};

export default env;
