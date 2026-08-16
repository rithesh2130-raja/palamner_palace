import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    mrp: {
      type: Number,
      default: function () {
        return Math.round(this.price * 1.25);
      },
    },
    discountPercentage: {
      type: Number,
      default: 20,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      required: true,
      default: 5,
    },
    reels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reel',
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
