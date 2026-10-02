import asyncHandler from '../utils/asyncHandler.js';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../services/productService.js';

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getProducts(req.query);
  res.json({ success: true, products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  res.json({ success: true, product });
});

export const createProductHandler = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProductHandler = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.json({ success: true, product });
});

export const deleteProductHandler = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ success: true, message: 'Product deleted successfully' });
});
