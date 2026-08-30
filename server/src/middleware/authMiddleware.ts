import { Request, Response, NextFunction } from "express";
// @ts-ignore
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required. Please log in.",
        },
      });
    }

    try {
      const secret = env.JWT_ACCESS_SECRET || "shopsphere_jwt_secret_dev";
      const decoded: any = jwt.verify(token, secret);
      const user = await User.findById(decoded.id || decoded.userId);

      if (!user || user.isActive === false) {
        return res.status(401).json({
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "User session invalid or user account deactivated.",
          },
        });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or expired authentication token.",
        },
      });
    }
  } catch (error) {
    return next(error);
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required.",
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Access denied. Insufficient permissions.",
        },
      });
    }

    return next();
  };
}
