import Campaign from '../models/campaignModel.js';

// @desc    Get Active Seller Promotional Campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'Active' })
      .populate('seller', 'name email')
      .populate('products', 'name price image brand');

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a New Campaign
// @route   POST /api/campaigns
// @access  Private (Seller/Admin)
export const createCampaign = async (req, res) => {
  try {
    const { name, products, commissionRate, budget } = req.body;

    const campaign = new Campaign({
      seller: req.user ? req.user._id : null,
      name,
      products,
      commissionRate: commissionRate || 15,
      budget: budget || 1000,
    });

    const created = await campaign.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
