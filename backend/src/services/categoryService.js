import mongoose from 'mongoose';
import Category from '../models/Category.js';

export const getCategories = async () => Category.find().sort({ createdAt: -1 });

export const getCategoryBySlug = async (slug) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  const category = await Category.findOne(
    isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug }
  );

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const createCategory = async ({ name, slug, description, image }) => {
  const generatedSlug = (slug || name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await Category.findOne({
    $or: [{ name: name.trim() }, { slug: generatedSlug }],
  });

  if (existing) {
    const error = new Error('Category with this name or slug already exists');
    error.statusCode = 409;
    throw error;
  }

  const category = await Category.create({
    name: name.trim(),
    slug: generatedSlug,
    description: description || '',
    image: image || '',
  });

  return category;
};

export const updateCategory = async (id, data) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const category = await Category.findOne(
    isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
  );

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.name) category.name = data.name.trim();
  if (data.slug) category.slug = data.slug.trim();
  if (data.description !== undefined) category.description = data.description;
  if (data.image !== undefined) category.image = data.image;

  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const category = await Category.findOne(
    isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
  );

  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  await category.deleteOne();
  return category;
};
