import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'creator', 'admin'], default: 'customer' },
    avatar: { type: String },
    pincode: { type: String, default: '517408' },
    city: { type: String, default: 'Palamner, Andhra Pradesh' }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
