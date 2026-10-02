import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nailshop',
  JWT_SECRET: process.env.JWT_SECRET || 'nailshop-secret-key',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default env;
