import asyncHandler from '../utils/asyncHandler.js';
import {
  getAdminAllOrders,
  getAdminStats,
  getAdminUsers,
  getRecentOrders,
} from '../services/adminService.js';
import { updateOrderStatus } from '../services/orderService.js';

export const getAdminOverview = asyncHandler(async (req, res) => {
  const stats = await getAdminStats();
  res.json({
    success: true,
    stats,
  });
});

export const getAdminRecentOrders = asyncHandler(async (req, res) => {
  const orders = await getRecentOrders();
  res.json({
    success: true,
    orders,
  });
});

export const getAdminUsersHandler = asyncHandler(async (req, res) => {
  const users = await getAdminUsers();
  res.json({
    success: true,
    users,
  });
});

export const getAdminOrdersHandler = asyncHandler(async (req, res) => {
  const orders = await getAdminAllOrders();
  res.json({
    success: true,
    orders,
  });
});

export const updateAdminOrderStatusHandler = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await updateOrderStatus(req.params.id, status, paymentStatus);
  res.json({
    success: true,
    order,
  });
});
