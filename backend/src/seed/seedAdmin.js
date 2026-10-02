import mongoose from 'mongoose';
import User from '../models/User.js';
import env from '../config/env.js';

const seedAdmin = async () => {
  try {
    const password = process.env.ADMIN_PASSWORD?.trim();
    if (!password) {
      throw new Error('ADMIN_PASSWORD must be set before seeding an admin user.');
    }

    await mongoose.connect(env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@nailatelier.com';
    const name = process.env.ADMIN_NAME || 'Nail Atelier Admin';

    let admin = await User.findOne({ email: email.toLowerCase() });

    if (!admin) {
      admin = new User({
        name,
        email: email.toLowerCase(),
        password,
        role: 'admin',
      });
    } else {
      admin.name = name;
      admin.password = password;
      admin.role = 'admin';
    }

    await admin.save();
    console.log('Admin user ready:', {
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error('Admin seed error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
