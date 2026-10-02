import mongoose from 'mongoose';
import env from '../config/env.js';
import Category from '../models/Category.js';

const categories = [
  {
    name: 'Gel Polish',
    slug: 'gel-polish',
    description: 'High-gloss, long-lasting shades with salon-grade depth and shine.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Classic Nail Color',
    slug: 'classic-nail-color',
    description: 'Timeless polish tones designed for everyday polish and statement finishes.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Nail Art',
    slug: 'nail-art',
    description: 'Artful textures, metallics, and statement glazes for elevated self-expression.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Care Essentials',
    slug: 'care-essentials',
    description: 'Protective formulas and essentials that keep every manicure strong and smooth.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Tools and finishing accessories to complete your beauty ritual with ease.',
    image: 'https://images.unsplash.com/photo-1521590832167-7e3d5a3b0f5c?auto=format&fit=crop&w=900&q=80',
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    const existing = await Category.countDocuments();
    if (existing === 0) {
      await Category.insertMany(categories);
      console.log('Category seed data inserted:', categories.length);
    } else {
      console.log('Categories already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Category seed error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();

export default seedCategories;
