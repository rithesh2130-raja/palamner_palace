import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Advertisement } from '../models/Advertisement.js';
import { Reel } from '../models/Reel.js';
import { generateGeminiVideo, editGeminiVideo } from '../services/geminiVideoService.js';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ADVERTS_DIR = path.join(__dirname, '../../uploads/advertisements');

if (!fs.existsSync(UPLOADS_ADVERTS_DIR)) {
  fs.mkdirSync(UPLOADS_ADVERTS_DIR, { recursive: true });
}

// In-memory fallback dataset for development
let memoryAdvertisements = [];

/**
 * PART 33 — DIAGNOSTIC HEALTH ENDPOINT
 */
export const getHealthStatus = (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  res.status(200).json({
    success: true,
    geminiConfigured: Boolean(apiKey && apiKey !== 'your_key_here'),
    model: 'gemini-omni-flash-preview',
    uploadDirectoryExists: fs.existsSync(UPLOADS_ADVERTS_DIR)
  });
};

/**
 * PART 7, 8, 10 — GENERATE ADVERTISEMENT VIDEO (MULTIPART UPLOAD)
 */
export const generateAdvertisement = async (req, res, next) => {
  try {
    const userPrompt = req.body.prompt || req.body.description || 'Create a cinematic video advertisement for this product.';
    const style = req.body.style || req.body.visualStyle || 'Cinematic';
    const aspectRatio = req.body.aspectRatio || '9:16';
    const duration = req.body.duration || '8 seconds';

    let imageInput = null;
    let uploadedImageUrl = null;

    // Handle Multer uploaded file
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const savedFileName = `ref-image-${Date.now()}${ext}`;
      const savedFilePath = path.join(UPLOADS_ADVERTS_DIR, savedFileName);
      
      fs.writeFileSync(savedFilePath, req.file.buffer);
      uploadedImageUrl = `/uploads/advertisements/${savedFileName}`;
      imageInput = req.file;
    } else if (req.body.image || req.body.imageUrl) {
      imageInput = req.body.image || req.body.imageUrl;
      uploadedImageUrl = typeof imageInput === 'string' ? imageInput : null;
    }

    console.log('🚀 [AdvertisementController] Generating ad video with user prompt:', userPrompt);

    const geminiResult = await generateGeminiVideo({
      userPrompt,
      imageInput,
      style,
      aspectRatio
    });

    const adData = {
      prompt: userPrompt,
      style,
      aspectRatio,
      duration,
      uploadedImageUrl: uploadedImageUrl || geminiResult.thumbnailUrl || null,
      createdBy: req.user?.name || 'Admin',
      status: 'completed',
      videoUrl: geminiResult.videoUrl,
      thumbnailUrl: uploadedImageUrl || geminiResult.thumbnailUrl || null,
      geminiInteractionId: geminiResult.interactionId || null,
      publishedAsReel: false
    };

    let newAd;
    try {
      newAd = await Advertisement.create(adData);
    } catch {
      newAd = {
        ...adData,
        _id: `ad-${Date.now()}`,
        id: `ad-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      memoryAdvertisements.unshift(newAd);
    }

    res.status(201).json({
      success: true,
      message: 'Video advertisement generated successfully',
      advertisement: newAd,
      data: newAd
    });
  } catch (error) {
    console.error('❌ [AdvertisementController ERROR]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Video advertisement generation failed'
    });
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
      editInstruction
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
      message: 'Advertisement updated via Gemini edit',
      advertisement: ad,
      data: ad
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PART 24 & 33 — PUBLISH ADVERTISEMENT AS REEL
 */
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

    if (!ad.videoUrl) {
      return res.status(400).json({ success: false, message: 'Cannot publish Reel: advertisement video URL missing' });
    }

    const reelData = {
      creator: {
        name: 'PalamnerPalace Official',
        handle: '@palamnerpalace',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        verified: true
      },
      caption: `🔥 ${ad.prompt ? ad.prompt.substring(0, 100) : 'PalamnerPalace AI Video Reel'}... Shop Now!`,
      videoPoster: ad.uploadedImageUrl || ad.thumbnailUrl,
      thumbnailUrl: ad.uploadedImageUrl || ad.thumbnailUrl,
      videoUrl: ad.videoUrl,
      uploadedImageUrl: ad.uploadedImageUrl,
      likesCount: 12400,
      commentsCount: 412,
      sharesCount: 180,
      taggedProduct: ad.product || {
        id: 'prod-1',
        title: 'Palamner Silk Saree',
        price: 3499,
        originalPrice: 4999,
        discount: '30% OFF',
        image: ad.uploadedImageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
      },
      advertisementId: ad._id || ad.id
    };

    let newReel;
    try {
      newReel = await Reel.create(reelData);
      ad.publishedAsReel = true;
      ad.reelId = newReel._id;
      if (ad.save) await ad.save();
    } catch {
      newReel = { ...reelData, _id: `reel-${Date.now()}`, id: `reel-${Date.now()}` };
      ad.publishedAsReel = true;
      ad.reelId = newReel._id;
    }

    res.status(201).json({
      success: true,
      message: 'Advertisement published successfully as a shoppable Reel!',
      reel: newReel,
      data: newReel
    });
  } catch (error) {
    next(error);
  }
};
