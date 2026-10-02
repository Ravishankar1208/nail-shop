import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCartForUser = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  return cart || { user: userId, items: [], total: 0 };
};

export const addItemToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });
  const safeQty = Number(quantity) > 0 ? Number(quantity) : 1;

  if (!cart) {
    const newCart = await Cart.create({
      user: userId,
      items: [{ product: product._id, quantity: safeQty, price: product.price }],
      total: product.price * safeQty,
    });

    return newCart.populate('items.product');
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity += safeQty;
    cart.items[itemIndex].price = product.price;
  } else {
    cart.items.push({ product: product._id, quantity: safeQty, price: product.price });
  }

  cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  await cart.save();
  return cart.populate('items.product');
};

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const item = cart.items.find((entry) => entry.product.toString() === productId);

  if (!item) {
    const error = new Error('Product not found in cart');
    error.statusCode = 404;
    throw error;
  }

  item.quantity = Number(quantity) > 0 ? Number(quantity) : 1;
  cart.total = cart.items.reduce((sum, entry) => sum + entry.quantity * entry.price, 0);
  await cart.save();
  return cart.populate('items.product');
};

export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  await cart.save();
  return cart.populate('items.product');
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  cart.items = [];
  cart.total = 0;
  await cart.save();
  return cart;
};
