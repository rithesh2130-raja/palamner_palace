import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, default: 'system' }
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
