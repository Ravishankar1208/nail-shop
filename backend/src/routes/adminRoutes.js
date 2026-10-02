import express from 'express';
import {
  getAdminOrdersHandler,
  getAdminOverview,
  getAdminRecentOrders,
  getAdminUsersHandler,
  updateAdminOrderStatusHandler,
} from '../controllers/adminController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser, authorizeAdmin);

router.get('/stats', getAdminOverview);
router.get('/recent-orders', getAdminRecentOrders);
router.get('/users', getAdminUsersHandler);
router.get('/orders', getAdminOrdersHandler);
router.put('/orders/:id/status', updateAdminOrderStatusHandler);

export default router;
