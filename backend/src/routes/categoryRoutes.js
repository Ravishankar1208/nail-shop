import express from 'express';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategories,
  getCategory,
  updateCategoryHandler,
} from '../controllers/categoryController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllCategories)
  .post(authenticateUser, authorizeAdmin, createCategoryHandler);

router.route('/:slug')
  .get(getCategory)
  .put(authenticateUser, authorizeAdmin, updateCategoryHandler)
  .delete(authenticateUser, authorizeAdmin, deleteCategoryHandler);

export default router;
