import { Request, Response } from "express";
import mongoose from "mongoose";

export function getHealthStatus(_req: Request, res: Response): void {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: "ShopSphere API is running",
    timestamp: new Date().toISOString(),
    data: {
      backend: "Connected",
      database: isDbConnected ? "Connected" : "Disconnected",
    },
  });
}
