import Seller from '../models/sellerModel.js';

// @desc    Get all sellers
// @route   GET /api/sellers
// @access  Private/Admin
const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({});
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a seller
// @route   POST /api/sellers
// @access  Private/Admin
const createSeller = async (req, res) => {
  try {
    const { name, email, commissionRate } = req.body;

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    const seller = new Seller({
      name,
      email,
      commissionRate: commissionRate === undefined ? 10 : commissionRate,
    });

    const createdSeller = await seller.save();
    res.status(201).json(createdSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a seller
// @route   PUT /api/sellers/:id
// @access  Private/Admin
const updateSeller = async (req, res) => {
  try {
    const { name, email, status, commissionRate } = req.body;
    const seller = await Seller.findById(req.params.id);

    if (seller) {
      seller.name = name || seller.name;
      seller.email = email || seller.email;
      seller.status = status || seller.status;
      seller.commissionRate = commissionRate === undefined ? seller.commissionRate : commissionRate;

      const updatedSeller = await seller.save();
      res.json(updatedSeller);
    } else {
      res.status(404).json({ message: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a seller
// @route   DELETE /api/sellers/:id
// @access  Private/Admin
const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (seller) {
      await Seller.deleteOne({ _id: seller._id });
      res.json({ message: 'Seller removed' });
    } else {
      res.status(404).json({ message: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getSellers, createSeller, updateSeller, deleteSeller };
