import asyncHandler from '../utils/asyncHandler.js';
import { getUserProfile, loginUser, registerUser } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({
    success: true,
    user: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json({
    success: true,
    user: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user._id);
  res.json({
    success: true,
    user,
  });
});
