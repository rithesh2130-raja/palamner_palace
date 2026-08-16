import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Seller from './models/sellerModel.js';
import Setting from './models/settingModel.js';
import Reel from './models/reelModel.js';
import CreatorProfile from './models/creatorProfileModel.js';
import Comment from './models/commentModel.js';
import Campaign from './models/campaignModel.js';
import Affiliate from './models/affiliateModel.js';
import products from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Seller.deleteMany();
    await Setting.deleteMany();
    await Reel.deleteMany();
    await CreatorProfile.deleteMany();
    await Comment.deleteMany();
    await Campaign.deleteMany();
    await Affiliate.deleteMany();

    // Create default store configurations
    await Setting.create({
      storeName: 'ShopSphere',
      currency: 'USD',
      taxRate: 15,
      shippingRate: 10,
    });

    // Create default sellers
    const createdSellers = await Seller.create([
      { name: 'Apple Electronics Ltd.', email: 'seller@apple.com', status: 'Approved', commissionRate: 8 },
      { name: 'Logitech Authorized', email: 'seller@logitech.com', status: 'Approved', commissionRate: 12 },
      { name: 'Sony Entertainment', email: 'seller@sony.com', status: 'Approved', commissionRate: 10 },
      { name: 'General Retailer Vendor', email: 'seller@retailer.com', status: 'Pending', commissionRate: 15 },
    ]);

    // Create seed users
    const createdUsers = await User.create([
      {
        name: 'Admin User',
        username: 'shopsphereadmin',
        email: 'admin@email.com',
        password: 'password123',
        isAdmin: true,
        role: 'SuperAdmin',
        roles: ['Customer', 'Admin', 'SuperAdmin', 'Creator'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Official Admin & Creator at ShopSphere',
      },
      {
        name: 'Alex TechCreator',
        username: 'techcreator',
        email: 'alex@creator.com',
        password: 'password123',
        isAdmin: false,
        role: 'Creator',
        roles: ['Customer', 'Creator'],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bio: 'Unboxing the future of tech accessories & setup gadgets 🎧⚡',
        followersCount: 14200,
        followingCount: 120,
      },
      {
        name: 'Sarah SetupGirl',
        username: 'gadgetgirl',
        email: 'sarah@creator.com',
        password: 'password123',
        isAdmin: false,
        role: 'Creator',
        roles: ['Customer', 'Creator'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Aesthetic desk setups, reviews & deals 🖥️✨',
        followersCount: 28900,
        followingCount: 85,
      },
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@email.com',
        password: 'password123',
        isAdmin: false,
        role: 'Customer',
        roles: ['Customer'],
      },
      {
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@email.com',
        password: 'password123',
        isAdmin: false,
        role: 'Customer',
        roles: ['Customer'],
        status: 'Blocked',
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const creator1 = createdUsers[1]._id;
    const creator2 = createdUsers[2]._id;
    const customerUser = createdUsers[3]._id;

    // Create Creator Profiles
    await CreatorProfile.create([
      {
        user: creator1,
        bio: 'Unboxing the future of tech accessories & setup gadgets 🎧⚡',
        isVerified: true,
        followersCount: 14200,
        totalViews: 85400,
        totalLikes: 6400,
        totalEarnings: 820.50,
        categories: ['Electronics', 'Accessories', 'Gaming'],
      },
      {
        user: creator2,
        bio: 'Aesthetic desk setups, reviews & deals 🖥️✨',
        isVerified: true,
        followersCount: 28900,
        totalViews: 142000,
        totalLikes: 18500,
        totalEarnings: 1450.00,
        categories: ['Accessories', 'Gaming'],
      },
    ]);

    // Map products
    const sampleProducts = products.map((product, index) => {
      const sellerId = createdSellers[index % 3]._id;
      let countInStock = product.countInStock;
      if (index === 0) countInStock = 2;
      if (index === 4) countInStock = 4;
      if (index === 5) countInStock = 0;

      return {
        ...product,
        user: adminUser,
        seller: sellerId,
        countInStock,
        reorderLevel: 5,
        isActive: true,
      };
    });

    const insertedProducts = await Product.insertMany(sampleProducts);

    // Create Sample Video Reels
    const sampleReels = await Reel.create([
      {
        creator: creator1,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
        caption: 'Unboxing my Ultimate Gaming Headphones! Premium audio clarity & ANC 🎧 🔥 #Gaming #Headphones #ShopSphere',
        hashtags: ['Gaming', 'Headphones', 'TechReview'],
        category: 'Electronics',
        products: [
          { product: insertedProducts[0]._id, discountTag: '20% OFF' },
        ],
        duration: 18,
        views: 12400,
        likes: [customerUser],
        commentsCount: 2,
        shares: 45,
        saves: [customerUser],
        status: 'Approved',
      },
      {
        creator: creator2,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
        caption: 'The most comfortable Ergonomic Mouse for productivity 🖱️ ⚡ #Tech #Productivity #ShopSphere',
        hashtags: ['Productivity', 'Ergonomics', 'Mouse'],
        category: 'Accessories',
        products: [
          { product: insertedProducts[1]._id, discountTag: '15% OFF' },
        ],
        duration: 14,
        views: 8900,
        likes: [customerUser],
        commentsCount: 1,
        shares: 28,
        saves: [],
        status: 'Approved',
      },
      {
        creator: creator1,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        caption: 'Desk Setup Upgrade: 4K Curved Ultra-Wide Gaming Display! 🖥️ ✨ #DeskSetup #Gaming',
        hashtags: ['DeskSetup', 'Monitor', 'GamingPC'],
        category: 'Gaming',
        products: [
          { product: insertedProducts[2]._id, discountTag: '$50 OFF' },
        ],
        duration: 22,
        views: 24500,
        likes: [customerUser],
        commentsCount: 3,
        shares: 110,
        saves: [customerUser],
        status: 'Approved',
      },
    ]);

    // Link Reels back to Products
    await Product.findByIdAndUpdate(insertedProducts[0]._id, { $push: { reels: sampleReels[0]._id } });
    await Product.findByIdAndUpdate(insertedProducts[1]._id, { $push: { reels: sampleReels[1]._id } });
    await Product.findByIdAndUpdate(insertedProducts[2]._id, { $push: { reels: sampleReels[2]._id } });

    // Seed Comments
    await Comment.create([
      {
        user: customerUser,
        reel: sampleReels[0]._id,
        text: 'Does this headphone feature active noise cancellation (ANC)?',
      },
      {
        user: creator1,
        reel: sampleReels[0]._id,
        text: 'Yes! It features dual-mode active noise suppression with 30hr battery life.',
        attachedProduct: insertedProducts[0]._id,
      },
    ]);

    // Seed Creator Campaign
    await Campaign.create({
      seller: adminUser,
      name: 'Summer Gaming Gear Creator Promotion',
      products: [insertedProducts[0]._id, insertedProducts[2]._id],
      commissionRate: 15,
      budget: 2500,
      creators: [creator1, creator2],
      status: 'Active',
    });

    // Seed Affiliate Transactions
    await Affiliate.create([
      {
        creator: creator1,
        reel: sampleReels[0]._id,
        product: insertedProducts[0]._id,
        commissionAmount: 24.50,
        status: 'Approved',
      },
    ]);

    // Create test order
    await Order.create([
      {
        user: customerUser,
        orderItems: [
          {
            name: insertedProducts[0].name,
            qty: 1,
            image: insertedProducts[0].image,
            price: insertedProducts[0].price,
            product: insertedProducts[0]._id,
          },
        ],
        shippingAddress: {
          address: '123 ShopSphere Ave',
          city: 'New York',
          postalCode: '10001',
          country: 'USA',
        },
        paymentMethod: 'PayPal',
        itemsPrice: insertedProducts[0].price,
        taxPrice: 20.0,
        shippingPrice: 0.0,
        totalPrice: insertedProducts[0].price + 20.0,
        isPaid: true,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'Delivered',
        commissionPaid: 24.50,
      },
    ]);

    console.log('ShopSphere Social-Commerce Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-destroy') {
  console.log('Data Destroy placeholder');
  process.exit();
} else {
  importData();
}
