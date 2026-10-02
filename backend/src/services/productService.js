import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const getProducts = async (filters = {}) => {
  const { search, category, sort } = filters;
  const query = {};

  if (search) {
    const searchTerm = search.trim();
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { shade: { $regex: searchTerm, $options: 'i' } },
        { color: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }
  }

  if (category) {
    query.category = category;
  }

  let productsQuery = Product.find(query);

  switch (sort) {
    case 'low-high':
      productsQuery = productsQuery.sort({ price: 1 });
      break;
    case 'high-low':
      productsQuery = productsQuery.sort({ price: -1 });
      break;
    case 'rating':
      productsQuery = productsQuery.sort({ rating: -1 });
      break;
    case 'newest':
      productsQuery = productsQuery.sort({ createdAt: -1 });
      break;
    default:
      productsQuery = productsQuery.sort({ featured: -1, rating: -1, createdAt: -1 });
      break;
  }

  return productsQuery;
};

const buildProductLookupQuery = (id) => {
  const rawId = String(id).trim();
  const query = { $or: [] };

  if (mongoose.Types.ObjectId.isValid(rawId)) {
    query.$or.push({ _id: rawId });
  }

  const numericId = Number(rawId);
  if (!Number.isNaN(numericId)) {
    query.$or.push({ id: numericId });
  }

  query.$or.push({ slug: rawId });

  return query;
};

export const getProductById = async (id) => {
  const product = await Product.findOne(buildProductLookupQuery(id));

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};



export const updateProduct = async (id, productData) => {
  const product = await Product.findOne(buildProductLookupQuery(id));

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  Object.assign(product, productData);
  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findOne(buildProductLookupQuery(id));

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  await product.deleteOne();
  return product;
};
