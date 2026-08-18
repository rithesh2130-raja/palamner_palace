import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    shippingAddress: {
      city: { type: String },
      pincode: { type: String }
    }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
