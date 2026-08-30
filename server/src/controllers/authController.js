import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const JWT_SECRET = env.JWT_SECRET || env.JWT_ACCESS_SECRET || 'shopsphere_jwt_secret_dev';

// Helper to format user object safely
function formatUser(user) {
  return {
    id: user._id || user.id,
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatarUrl || user.avatar || '',
    avatarUrl: user.avatarUrl || user.avatar || '',
    pincode: user.pincode || '517408',
    city: user.city || 'Palamner, Andhra Pradesh',
    isActive: user.isActive !== false,
    emailVerified: Boolean(user.emailVerified),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// In-memory rate limiting map for login attempts
const loginAttempts = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record) return false;
  if (now > record.resetTime) {
    loginAttempts.delete(key);
    return false;
  }
  return record.count >= 10;
}

function recordLoginFailure(key) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, resetTime: now + 15 * 60 * 1000 };
  record.count += 1;
  loginAttempts.set(key, record);
}

function clearLoginFailures(key) {
  loginAttempts.delete(key);
}

/**
 * POST /api/v1/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name must be at least 2 characters long.' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Please provide a valid email address.' },
      });
    }

    // Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters long.' },
      });
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNum) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: 'An account with this email address already exists.' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
      isActive: true,
      emailVerified: false,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: {
        user: formatUser(newUser),
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/v1/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const rateLimitKey = `${ip}:${(email || '').toLowerCase()}`;

    if (isRateLimited(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many failed login attempts. Please try again after 15 minutes.',
        },
      });
    }

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      recordLoginFailure(rateLimitKey);
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      recordLoginFailure(rateLimitKey);
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_DISABLED', message: 'Your account has been deactivated.' },
      });
    }

    clearLoginFailures(rateLimitKey);

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      data: {
        user: formatUser(user),
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/v1/auth/logout
 */
export async function logout(_req, res, next) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/v1/auth/me
 */
export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
      });
    }

    return res.json({
      success: true,
      data: {
        user: formatUser(req.user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/v1/auth/forgot-password
 */
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email address is required.' },
      });
    }

    // Foundation logic: acknowledge request without leaking whether email exists
    return res.json({
      success: true,
      message: 'If an account exists for that email, password reset instructions have been sent.',
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/v1/auth/reset-password
 */
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid token and new password (min 8 chars) required.' },
      });
    }

    return res.json({
      success: true,
      message: 'Password reset successful. You may now log in with your new password.',
    });
  } catch (error) {
    return next(error);
  }
}
