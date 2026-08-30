import { User } from '../models/User.js';

function formatUserResponse(user) {
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

/**
 * GET /api/v1/users/me
 */
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User profile not found.' },
      });
    }

    return res.json({
      success: true,
      data: {
        user: formatUserResponse(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * PATCH /api/v1/users/me
 */
export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User profile not found.' },
      });
    }

    const { name, avatarUrl, avatar, pincode, city } = req.body || {};

    if (name && typeof name === 'string' && name.trim().length >= 2) {
      user.name = name.trim();
    }

    if (avatarUrl !== undefined && typeof avatarUrl === 'string') {
      user.avatarUrl = avatarUrl.trim();
      user.avatar = avatarUrl.trim();
    } else if (avatar !== undefined && typeof avatar === 'string') {
      user.avatar = avatar.trim();
      user.avatarUrl = avatar.trim();
    }

    if (pincode !== undefined && typeof pincode === 'string') {
      user.pincode = pincode.trim();
    }

    if (city !== undefined && typeof city === 'string') {
      user.city = city.trim();
    }

    await user.save();

    return res.json({
      success: true,
      data: {
        user: formatUserResponse(user),
      },
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    return next(error);
  }
}
