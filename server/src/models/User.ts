import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "customer" | "user" | "creator" | "seller" | "admin";
  avatar?: string;
  avatarUrl?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  pincode?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "user", "creator", "seller", "admin"], default: "customer" },
    avatar: { type: String },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    pincode: { type: String, default: "517408" },
    city: { type: String, default: "Palamner, Andhra Pradesh" },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: any) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
