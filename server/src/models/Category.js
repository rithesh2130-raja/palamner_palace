import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    itemCount: { type: Number, default: 0 },
    icon: { type: String },
    image: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
