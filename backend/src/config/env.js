import dotenv from 'dotenv';

dotenv.config();

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
};

export default env;
