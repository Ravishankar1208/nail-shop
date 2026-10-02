import express from 'express';
import {
  createOrderHandler,
  getAllOrdersHandler,
  getOrder,
  getUserOrders,
  updateOrderStatusHandler,
} from '../controllers/orderController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createOrderHandler);
router.get('/', getUserOrders);
router.get('/my-orders', getUserOrders);
router.get('/admin/all', authorizeAdmin, getAllOrdersHandler);
router.get('/:id', getOrder);
router.put('/:id/status', authorizeAdmin, updateOrderStatusHandler);

export default router;
