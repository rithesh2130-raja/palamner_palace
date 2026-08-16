import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      default: 'ShopSphere',
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    taxRate: {
      type: Number,
      required: true,
      default: 15, // 15% GST/tax
    },
    shippingRate: {
      type: Number,
      required: true,
      default: 10, // $10 standard shipping
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
