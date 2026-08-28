import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "customer" | "creator" | "admin";
  avatar?: string;
  pincode?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "creator", "admin"], default: "customer" },
    avatar: { type: String },
    pincode: { type: String, default: "517408" },
    city: { type: String, default: "Palamner, Andhra Pradesh" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
