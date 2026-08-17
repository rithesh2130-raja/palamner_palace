import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed. Check MONGODB_URI in your environment variables.",
    );
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("[Database] MongoDB Disconnected gracefully.");
  } catch (error) {
    console.error("[Database] Disconnect Error:", error);
  }
}
