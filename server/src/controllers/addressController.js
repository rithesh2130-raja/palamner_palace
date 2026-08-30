import { Address } from '../models/Address.js';

/**
 * GET /api/v1/addresses
 */
export async function getAddresses(req, res, next) {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

    return res.json({
      success: true,
      data: {
        addresses,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/v1/addresses
 */
export async function createAddress(req, res, next) {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country = 'India',
      landmark,
      isDefault = false,
    } = req.body || {};

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name, phone, address line 1, city, state, and postal code are required.',
        },
      });
    }

    const existingCount = await Address.countDocuments({ userId: req.user._id });
    const shouldBeDefault = Boolean(isDefault) || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.user._id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: (addressLine2 || '').trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: (country || 'India').trim(),
      landmark: (landmark || '').trim(),
      isDefault: shouldBeDefault,
    });

    return res.status(201).json({
      success: true,
      data: {
        address,
      },
      message: 'Address created successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * PATCH /api/v1/addresses/:id
 */
export async function updateAddress(req, res, next) {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Address not found.' },
      });
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to modify this address.' },
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault,
    } = req.body || {};

    if (fullName !== undefined) address.fullName = fullName.trim();
    if (phone !== undefined) address.phone = phone.trim();
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1.trim();
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2.trim();
    if (city !== undefined) address.city = city.trim();
    if (state !== undefined) address.state = state.trim();
    if (postalCode !== undefined) address.postalCode = postalCode.trim();
    if (country !== undefined) address.country = country.trim();
    if (landmark !== undefined) address.landmark = landmark.trim();

    if (isDefault === true && !address.isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
      address.isDefault = true;
    }

    await address.save();

    return res.json({
      success: true,
      data: {
        address,
      },
      message: 'Address updated successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * DELETE /api/v1/addresses/:id
 */
export async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Address not found.' },
      });
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this address.' },
      });
    }

    const wasDefault = address.isDefault;
    await Address.findByIdAndDelete(id);

    if (wasDefault) {
      const remainingAddress = await Address.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await remainingAddress.save();
      }
    }

    const remainingAddresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

    return res.json({
      success: true,
      data: {
        addresses: remainingAddresses,
      },
      message: 'Address deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/v1/addresses/:id/default
 */
export async function setDefaultAddress(req, res, next) {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Address not found.' },
      });
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to modify this address.' },
      });
    }

    await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

    return res.json({
      success: true,
      data: {
        addresses,
        defaultAddress: address,
      },
      message: 'Default address set successfully.',
    });
  } catch (error) {
    return next(error);
  }
}
