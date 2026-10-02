import express from 'express';
import {
  createProductHandler,
  deleteProductHandler,
  getAllProducts,
  getProduct,
  updateProductHandler,
} from '../controllers/productController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllProducts)
  .post(authenticateUser, authorizeAdmin, createProductHandler);

router.route('/:id')
  .get(getProduct)
  .put(authenticateUser, authorizeAdmin, updateProductHandler)
  .delete(authenticateUser, authorizeAdmin, deleteProductHandler);

export default router;
