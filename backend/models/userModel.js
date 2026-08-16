import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return this.name
          ? this.name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000)
          : 'user' + Math.floor(Math.random() * 10000);
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    bio: {
      type: String,
      default: 'ShopSphere Social Marketplace Member',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: 'Customer',
      enum: ['SuperAdmin', 'ProductManager', 'OrderManager', 'Finance', 'Customer', 'Creator', 'Seller'],
    },
    roles: [
      {
        type: String,
        enum: ['Customer', 'Creator', 'Seller', 'Admin', 'SuperAdmin'],
        default: 'Customer',
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    interests: {
      type: Map,
      of: Number,
      default: { Gaming: 50, Electronics: 50, Accessories: 50, Fashion: 20 },
    },
    status: {
      type: String,
      required: true,
      default: 'Active',
      enum: ['Active', 'Blocked'],
    },
  },
  {
    timestamps: true,
  }
);

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Automatic password hashing pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
