import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 10 },
    isNewItem: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    description: { type: String },
    image: { type: String, required: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
