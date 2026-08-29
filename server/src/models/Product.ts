import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;

  brand?: string;
  category: string;
  subcategory?: string;

  price: number;
  compareAtPrice?: number;

  stock: number;
  sku: string;

  images: IProductImage[];

  rating: number;
  reviewCount: number;

  tags: string[];

  isFeatured: boolean;
  isActive: boolean;

  sellerId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    subcategory: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String,
        alt: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Weighted MongoDB Text Search Index
ProductSchema.index(
  {
    name: "text",
    brand: "text",
    category: "text",
    subcategory: "text",
    tags: "text",
    description: "text",
  },
  {
    weights: {
      name: 10,
      brand: 8,
      category: 5,
      tags: 4,
      subcategory: 3,
      description: 1,
    },
    name: "ProductTextSearchIndex",
  }
);

// Sorting & Filtering Field Indexes
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ reviewCount: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isActive: 1, category: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
