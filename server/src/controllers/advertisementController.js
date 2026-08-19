import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Advertisement } from '../models/Advertisement.js';
import { Reel } from '../models/Reel.js';
import { generateFalVideo } from '../services/falVideoService.js';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_ADVERTS_DIR = path.join(__dirname, '../../uploads/advertisements');
const UPLOADS_REFS_DIR = path.join(__dirname, '../../uploads/references');

if (!fs.existsSync(UPLOADS_ADVERTS_DIR)) {
  fs.mkdirSync(UPLOADS_ADVERTS_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_REFS_DIR)) {
  fs.mkdirSync(UPLOADS_REFS_DIR, { recursive: true });
}

let memoryAdvertisements = [];

/**
 * DIAGNOSTIC HEALTH ENDPOINT
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
 * GENERATE ADVERTISEMENT VIDEO
 */
export const generateAdvertisement = async (req, res, next) => {
  try {
    const generationId = crypto.randomUUID();
    const userPrompt = req.body.prompt || req.body.description || 'Animate the supplied product image into a single continuous product video. Keep the exact product visible throughout.';
    const style = req.body.style || req.body.visualStyle || 'Cinematic';
    const aspectRatio = req.body.aspectRatio || '9:16';

    if (!req.file || req.file.size === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product reference image (JPEG, PNG, WEBP) is required.'
      });
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only JPEG, PNG, and WEBP image formats are supported.'
      });
    }

    const inputImageHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const ext = path.extname(req.file.originalname) || '.jpg';
    const refFileName = `ref-${generationId}${ext}`;
    const refFilePath = path.join(UPLOADS_REFS_DIR, refFileName);

    fs.writeFileSync(refFilePath, req.file.buffer);
    const uploadedImageUrl = `/uploads/references/${refFileName}`;

    console.log('===========================================================');
    console.log('ADVERTISEMENT GENERATION REQUEST');
    console.log('generationId:    ', generationId);
    console.log('inputImage:      ', req.file.originalname);
    console.log('inputImageHash:  ', inputImageHash);
    console.log('inputImageSize:  ', req.file.size, 'bytes');
    console.log('===========================================================');

    // Execute fal.ai Wan 2.6 Video Generation
    const falResult = await generateFalVideo({
      generationId,
      userPrompt,
      imageInput: req.file,
      style
    });

    const adData = {
      generationId,
      geminiInteractionId: falResult.falRequestId || null,
      isRealGeminiOutput: falResult.isRealFalOutput || false,
      quotaErrorOccurred: falResult.quotaErrorOccurred || false,
      inputImageHash,
      videoHash: falResult.videoHash,
      prompt: userPrompt,
      style,
      aspectRatio,
      uploadedImageUrl,
      createdBy: req.user?.name || 'Admin',
      status: 'completed',
      videoUrl: falResult.videoUrl,
      thumbnailUrl: falResult.thumbnailUrl || uploadedImageUrl,
      publishedAsReel: false
    };

    let newAd;
    try {
      newAd = await Advertisement.create(adData);
    } catch {
      newAd = {
        ...adData,
        _id: `ad-${generationId}`,
        id: `ad-${generationId}`,
        createdAt: new Date().toISOString()
      };
      memoryAdvertisements.unshift(newAd);
    }

    console.log('[Database Record Saved]', {
      generationId: newAd.generationId,
      advertisementId: newAd._id || newAd.id,
      geminiInteractionId: newAd.geminiInteractionId,
      inputImageHash: newAd.inputImageHash,
      videoHash: newAd.videoHash,
      videoUrl: newAd.videoUrl
    });

    res.status(201).json({
      success: true,
      message: 'AI Advertisement video generated successfully!',
      advertisement: newAd,
      data: newAd
    });
  } catch (error) {
    console.error('❌ [AdvertisementController ERROR]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'AI Advertisement generation failed.'
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
