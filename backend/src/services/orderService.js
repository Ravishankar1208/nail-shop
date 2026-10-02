import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async ({ userId, items, shippingAddress, paymentMethod, totalAmount }) => {
  if (!items || items.length === 0) {
    const error = new Error('Order must contain at least one item');
    error.statusCode = 400;
    throw error;
  }

  const resolvedItems = await Promise.all(
    items.map(async (item) => {
      const rawId = item.product || item._id || item.id;
      let productDoc = null;

      if (rawId && mongoose.Types.ObjectId.isValid(String(rawId))) {
        productDoc = await Product.findById(rawId);
      }
      if (!productDoc && rawId) {
        const numId = Number(rawId);
        productDoc = await Product.findOne({
          $or: [
            ...(Number.isNaN(numId) ? [] : [{ id: numId }]),
            { slug: String(rawId) },
          ],
        });
      }

      return {
        product: productDoc ? productDoc._id : rawId,
        name: item.name || productDoc?.name || 'Nail Polish',
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        price: Number(item.price ?? productDoc?.price ?? 0),
      };
    })
  );

  const order = await Order.create({
    user: userId,
    items: resolvedItems,
    shippingAddress: {
      fullName: shippingAddress?.fullName || 'Client',
      phone: shippingAddress?.phone || '',
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || 'Maharashtra',
      postalCode: shippingAddress?.postalCode || '',
      country: shippingAddress?.country || 'India',
    },
    paymentMethod: paymentMethod || 'cod',
    totalAmount:
      Number(totalAmount) ||
      resolvedItems.reduce((acc, it) => acc + it.price * it.quantity, 0),
    orderStatus: 'pending',
    paymentStatus: 'pending',
  });

  return order;
};

export const getOrdersForUser = async (userId) =>
  Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');

export const getAllOrders = async () =>
  Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email').populate('items.product');

export const getOrderById = async (id, user) => {
  const query = user?.role === 'admin' ? { _id: id } : { _id: id, user: user?._id || user };
  const order = await Order.findOne(query).populate('user', 'name email').populate('items.product');

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const updateOrderStatus = async (id, status, paymentStatus) => {
  const order = await Order.findById(id);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (status) {
    order.orderStatus = status;
  }
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();
  return order.populate('user', 'name email');
};
