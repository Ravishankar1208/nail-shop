import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';
import User from '../models/User.js';

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    req.user = user;
    req.auth = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

export const authorizeAdmin = (req, res, next) => {
  if (
    !req.user ||
    req.user.role !== 'admin' ||
    req.user.email?.toLowerCase() !== env.ADMIN_EMAIL ||
    req.auth?.admin !== true
  ) {
    res.status(403);
    throw new Error('Access denied. Admin rights required');
  }

  next();
};

export default authenticateUser;
