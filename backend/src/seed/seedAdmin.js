import mongoose from 'mongoose';
import User from '../models/User.js';
import env from '../config/env.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: name } = env;

    let admin = await User.findOne({ email });

    if (!admin) {
      admin = new User({
        name,
        email,
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
