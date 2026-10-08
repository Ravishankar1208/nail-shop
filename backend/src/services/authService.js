import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import env from '../config/env.js';

export const registerUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'user',
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const isConfiguredAdmin =
    normalizedEmail === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD;

  if (isConfiguredAdmin) {
    let admin = await User.findOne({ email: env.ADMIN_EMAIL });
    if (!admin) {
      admin = new User({
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: 'admin',
      });
    } else {
      admin.name = env.ADMIN_NAME;
      admin.password = env.ADMIN_PASSWORD;
      admin.role = 'admin';
    }

    await admin.save();
    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      token: generateToken(admin._id, { admin: true }),
    };
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (
    !user ||
    user.role === 'admin' ||
    !(await bcrypt.compare(password, user.password))
  ) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const profile = user.toObject();
  if (profile.role === 'admin' && profile.email !== env.ADMIN_EMAIL) {
    profile.role = 'user';
  }

  return profile;
};
