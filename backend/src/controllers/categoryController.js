import asyncHandler from '../utils/asyncHandler.js';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from '../services/categoryService.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  res.json({ success: true, categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryBySlug(req.params.slug);
  res.json({ success: true, category });
});

export const createCategoryHandler = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);
  res.status(201).json({ success: true, category });
});

export const updateCategoryHandler = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  res.json({ success: true, category });
});

export const deleteCategoryHandler = asyncHandler(async (req, res) => {
  await deleteCategory(req.params.id);
  res.json({ success: true, message: 'Category deleted successfully' });
});
