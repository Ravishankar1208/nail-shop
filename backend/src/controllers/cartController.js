import asyncHandler from '../utils/asyncHandler.js';
import {
  addItemToCart,
  clearCart,
  getCartForUser,
  removeCartItem,
  updateCartItem,
} from '../services/cartService.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartForUser(req.user._id);
  res.json({ success: true, cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await addItemToCart(req.user._id, productId, quantity);
  res.status(201).json({ success: true, cart });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await updateCartItem(req.user._id, req.params.productId, quantity);
  res.json({ success: true, cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.user._id, req.params.productId);
  res.json({ success: true, cart, message: 'Item removed from cart' });
});

export const clearUserCart = asyncHandler(async (req, res) => {
  const cart = await clearCart(req.user._id);
  res.json({ success: true, cart, message: 'Cart cleared' });
});
