import asyncHandler from '../utils/asyncHandler.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersForUser,
  updateOrderStatus,
} from '../services/orderService.js';

export const createOrderHandler = asyncHandler(async (req, res) => {
  const order = await createOrder({
    userId: req.user._id,
    items: req.body.items,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'cod',
    totalAmount: req.body.totalAmount,
  });

  res.status(201).json({ success: true, order });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersForUser(req.user._id);
  res.json({ success: true, orders });
});

export const getAllOrdersHandler = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();
  res.json({ success: true, orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user);
  res.json({ success: true, order });
});

export const updateOrderStatusHandler = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await updateOrderStatus(req.params.id, status, paymentStatus);
  res.json({ success: true, order });
});
