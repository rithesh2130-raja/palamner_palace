import mongoose from 'mongoose';

const sellerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Suspended'],
    },
    commissionRate: {
      type: Number,
      required: true,
      default: 10, // 10% default commission
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model('Seller', sellerSchema);

export default Seller;
