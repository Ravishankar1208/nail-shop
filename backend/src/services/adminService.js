import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getAdminStats = async () => {
  const [totalProducts, totalUsers, totalOrders, salesResult] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
        },
      },
    ]),
  ]);

  return {
    totalProducts,
    totalUsers,
    totalOrders,
    totalSales: salesResult[0]?.totalSales || 0,
  };
};

export const getRecentOrders = async () => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .lean();

  return orders.map((order) => ({
    _id: order._id,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    user: order.user
      ? {
        _id: order.user._id,
        name: order.user.name,
        email: order.user.email,
      }
      : null,
  }));
};

export const getAdminUsers = async () => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  return users;
};

export const getAdminAllOrders = async () => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('items.product');
  return orders;
};
