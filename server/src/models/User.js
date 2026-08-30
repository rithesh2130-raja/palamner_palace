import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'user', 'creator', 'seller', 'admin'], default: 'customer' },
    avatar: { type: String },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    pincode: { type: String, default: '517408' },
    city: { type: String, default: 'Palamner, Andhra Pradesh' }
  },
  { timestamps: true }
);

// Virtual for avatarUrl fallback
userSchema.virtual('displayAvatar').get(function () {
  return this.avatarUrl || this.avatar || '';
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
