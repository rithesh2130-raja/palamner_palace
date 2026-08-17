import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} — Route Not Found`,
    code: "NOT_FOUND",
  });
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR";
  const message = err.message || "Something went wrong";

  const response: Record<string, unknown> = {
    success: false,
    message,
    code,
  };

  if (env.NODE_ENV === "development" && !(err instanceof AppError)) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
