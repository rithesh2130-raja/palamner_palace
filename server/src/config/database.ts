import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export async function connectDatabase(): Promise<typeof mongoose | null> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn("⚠️ MongoDB local connection notice:", error instanceof Error ? error.message : error);
    return null;
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected;
}

export async function disconnectDatabase(): Promise<void> {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      console.log("[Database] MongoDB Disconnected gracefully.");
    }
  } catch (error) {
    console.error("[Database] Disconnect Error:", error);
  }
}
