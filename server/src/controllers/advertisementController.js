import { Advertisement } from '../models/Advertisement.js';
import { Reel } from '../models/Reel.js';
import { generateGeminiVideo, editGeminiVideo } from '../services/geminiVideoService.js';

// In-memory fallback dataset for development
let memoryAdvertisements = [
  {
    _id: 'ad-mock-1',
    id: 'ad-mock-1',
    product: {
      id: 'prod-2',
      title: 'Wireless Active Noise Cancelling Headphones',
      brand: 'AcousticPalace',
      price: 2799,
      originalPrice: 3999,
      discountPercentage: 30,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    },
    createdBy: 'Admin',
    objective: 'Flash Sale',
    tone: 'Energetic',
    visualStyle: 'Cinematic',
    callToAction: 'Shop Now',
    duration: '8 seconds',
    aspectRatio: '9:16',
    status: 'completed',
    videoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    publishedAsReel: true,
    createdAt: new Date().toISOString()
  }
];

export const generateAdvertisement = async (req, res, next) => {
  try {
    const {
      product,
      objective,
      targetAudience,
      tone,
      visualStyle,
      callToAction,
      duration,
      aspectRatio
    } = req.body;

    if (!product || !product.id || !product.title) {
      return res.status(400).json({
        success: false,
        message: 'Product information (id and title) is required'
      });
    }

    const geminiResult = await generateGeminiVideo({
      productName: product.title,
      brand: product.brand,
      price: product.price,
      discount: product.discountPercentage,
      description: product.description,
      productImage: product.image,
      objective,
      targetAudience,
      tone,
      visualStyle,
      callToAction,
      duration,
      aspectRatio
    });

    const adData = {
      product,
      createdBy: req.user?.name || 'Admin',
      objective: objective || 'Product Launch',
      targetAudience: targetAudience || 'General Shoppers',
      tone: tone || 'Energetic',
      visualStyle: visualStyle || 'Cinematic',
      callToAction: callToAction || 'Shop Now',
      duration: duration || '8 seconds',
      aspectRatio: aspectRatio || '9:16',
      prompt: geminiResult.prompt,
      status: 'completed',
      videoUrl: geminiResult.videoUrl,
      thumbnailUrl: geminiResult.thumbnailUrl,
      geminiInteractionId: geminiResult.interactionId,
      publishedAsReel: false
    };

    let newAd;
    try {
      newAd = await Advertisement.create(adData);
    } catch {
      newAd = { ...adData, _id: `ad-${Date.now()}`, id: `ad-${Date.now()}`, createdAt: new Date().toISOString() };
      memoryAdvertisements.unshift(newAd);
    }

    res.status(201).json({
      success: true,
      message: 'Advertisement generated successfully via Gemini Omni API',
      data: newAd,
      meta: { mode: geminiResult.mode }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdvertisements = async (req, res, next) => {
  try {
    let ads = [];
    try {
      ads = await Advertisement.find().sort({ createdAt: -1 });
    } catch {
      ads = memoryAdvertisements;
    }

    res.status(200).json({
      success: true,
      count: ads.length,
      data: ads
    });
  } catch (error) {
    next(error);
  }
};

export const getAdvertisementById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let ad;
    try {
      ad = await Advertisement.findById(id);
    } catch {
      ad = memoryAdvertisements.find(a => a._id === id || a.id === id);
    }

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    res.status(200).json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

export const editAdvertisement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { editInstruction } = req.body;

    let ad;
    try {
      ad = await Advertisement.findById(id);
    } catch {
      ad = memoryAdvertisements.find(a => a._id === id || a.id === id);
    }

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const editResult = await editGeminiVideo(
      ad.geminiInteractionId || id,
      editInstruction,
      ad.product
    );

    ad.prompt = `${ad.prompt} | EDIT: ${editInstruction}`;
    ad.videoUrl = editResult.videoUrl || ad.videoUrl;

    try {
      if (ad.save) await ad.save();
    } catch {
      // Memory fallback
    }

    res.status(200).json({
      success: true,
      message: 'Advertisement updated via Gemini conversational edit',
      data: ad
    });
  } catch (error) {
    next(error);
  }
};

export const publishAdvertisementAsReel = async (req, res, next) => {
  try {
    const { id } = req.params;
    let ad;
    try {
      ad = await Advertisement.findById(id);
    } catch {
      ad = memoryAdvertisements.find(a => a._id === id || a.id === id);
    }

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const reelData = {
      creator: {
        name: 'PalamnerPalace Official',
        handle: '@palamnerpalace',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        verified: true
      },
      caption: `🔥 ${ad.product.title} — ${ad.callToAction}! ${ad.objective} special offer.`,
      videoPoster: ad.thumbnailUrl || ad.product.image,
      videoUrl: ad.videoUrl,
      likesCount: 1200,
      commentsCount: 84,
      sharesCount: 45,
      taggedProduct: {
        id: ad.product.id,
        title: ad.product.title,
        price: ad.product.price,
        originalPrice: ad.product.originalPrice,
        discount: `${ad.product.discountPercentage || 25}% OFF`,
        image: ad.product.image
      },
      advertisementId: ad._id
    };

    let newReel;
    try {
      newReel = await Reel.create(reelData);
      ad.publishedAsReel = true;
      ad.reelId = newReel._id;
      await ad.save();
    } catch {
      newReel = { ...reelData, _id: `reel-${Date.now()}`, id: `reel-${Date.now()}` };
      ad.publishedAsReel = true;
      ad.reelId = newReel._id;
    }

    res.status(201).json({
      success: true,
      message: 'Advertisement published successfully as a shoppable Reel!',
      data: newReel
    });
  } catch (error) {
    next(error);
  }
};
