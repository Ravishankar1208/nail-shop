import express from 'express';
import {
  addToCart,
  clearUserCart,
  getCart,
  removeFromCart,
  updateCart,
} from '../controllers/cartController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCart);
router.delete('/:productId', removeFromCart);
router.delete('/', clearUserCart);

export default router;
