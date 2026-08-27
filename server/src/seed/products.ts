import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere';

export async function seedProducts() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

    await Product.deleteMany({});
    console.log('[Seed] Cleared existing products.');

    console.log('[Seed] Seeding completed.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ [Seed] Error seeding products:', error);
  }
}
