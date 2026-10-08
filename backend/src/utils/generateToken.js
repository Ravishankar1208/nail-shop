import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateToken = (userId, claims = {}) =>
  jwt.sign({ id: userId, ...claims }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

export default generateToken;
