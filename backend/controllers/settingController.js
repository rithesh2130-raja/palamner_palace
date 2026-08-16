import Setting from '../models/settingModel.js';

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { storeName, currency, taxRate, shippingRate } = req.body;
    let settings = await Setting.findOne();

    if (settings) {
      settings.storeName = storeName || settings.storeName;
      settings.currency = currency || settings.currency;
      settings.taxRate = taxRate === undefined ? settings.taxRate : taxRate;
      settings.shippingRate = shippingRate === undefined ? settings.shippingRate : shippingRate;

      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      const newSettings = await Setting.create({ storeName, currency, taxRate, shippingRate });
      res.json(newSettings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getSettings, updateSettings };
