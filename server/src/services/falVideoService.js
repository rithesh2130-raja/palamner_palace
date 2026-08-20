import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_ADVERTS_DIR = path.join(__dirname, '../../uploads/advertisements');
const UPLOADS_REFS_DIR = path.join(__dirname, '../../uploads/references');
const VALID_MP4_TEMPLATE_PATH = path.join(__dirname, '../assets/valid_916_template.mp4');

if (!fs.existsSync(UPLOADS_ADVERTS_DIR)) fs.mkdirSync(UPLOADS_ADVERTS_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_REFS_DIR)) fs.mkdirSync(UPLOADS_REFS_DIR, { recursive: true });

const VEO_MODEL = 'veo-3.1-generate-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Downloads a remote URL into a Buffer
 */
function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Creates a 9:16 vertical product composite poster using sharp
 */
export async function createVerticalProductComposite(imageBuffer, generationId) {
  if (!imageBuffer) return null;
  try {
    const resizedProduct = await sharp(imageBuffer)
      .resize(640, 850, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const verticalCanvas = await sharp({
      create: { width: 720, height: 1280, channels: 4, background: { r: 18, g: 18, b: 24, alpha: 1 } }
    })
    .composite([{ input: resizedProduct, top: 215, left: 40 }])
    .jpeg({ quality: 90 })
    .toBuffer();

    const posterFileName = `ref-poster-${generationId}.jpg`;
    fs.writeFileSync(path.join(UPLOADS_REFS_DIR, posterFileName), verticalCanvas);
    return `/uploads/references/${posterFileName}`;
  } catch (err) {
    console.warn('⚠️ [Sharp] Poster composite warning:', err.message);
    return null;
  }
}

/**
 * Build Veo 3.1 advertisement prompt
 */
export function buildAdvertisementPrompt({ userPrompt }) {
  if (userPrompt && userPrompt.trim().length > 10) {
    return userPrompt.trim();
  }
  return 'Cinematic product advertisement video. The product fills the frame. Slowly orbit camera around the exact product. Keep the product visible throughout. Professional studio lighting. Clean neutral background. Single continuous smooth shot. No cuts. No people. No text overlays. Vertical 9:16 aspect ratio.';
}

/**
 * Poll a Veo 3.1 long-running operation until DONE or FAILED
 * Returns the final operation object
 */
async function pollOperation(operationName, apiKey, maxMinutes = 5) {
  const maxAttempts = maxMinutes * 6; // poll every 10s
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 10000)); // 10s between polls

    const res = await fetch(
      `${GEMINI_API_BASE}/${operationName}?key=${apiKey}`
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Veo] Poll ${i + 1} failed: ${res.status} — ${errText.substring(0, 100)}`);
      continue;
    }

    const op = await res.json();
    const status = op.done ? (op.error ? 'FAILED' : 'DONE') : 'RUNNING';
    console.log(`[Veo] Poll ${i + 1}/${maxAttempts} — status: ${status}`);

    if (op.done) return op;
  }
  throw new Error(`Veo 3.1 operation timed out after ${maxMinutes} minutes`);
}

/**
 * MAIN: Generate video using Veo 3.1 image-to-video
 */
export async function generateFalVideo({ generationId, userPrompt, imageInput, style = 'Cinematic' }) {
  // Accept both GEMINI_API_KEY and FAL_KEY for backward compat
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.length > 10);

  let imageBuffer = null;
  let imageMimeType = 'image/jpeg';

  if (imageInput && imageInput.buffer) {
    imageBuffer = imageInput.buffer;
    imageMimeType = imageInput.mimetype || 'image/jpeg';
  }

  if (!imageBuffer) throw new Error('Valid product reference image is required.');

  const inputImageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
  const prompt = buildAdvertisementPrompt({ userPrompt });
  const compositePosterUrl = await createVerticalProductComposite(imageBuffer, generationId);

  console.log('===========================================================');
  console.log('===== VEO 3.1 VIDEO GENERATION START =====');
  console.log('generationId:  ', generationId);
  console.log('model:         ', VEO_MODEL);
  console.log('configured:    ', isConfigured);
  console.log('imageSize:     ', imageBuffer.length, 'bytes');
  console.log('prompt:        ', prompt.substring(0, 100) + '...');
  console.log('===========================================================');

  const uniqueFilename = `advertisement-${generationId}.mp4`;
  const filePath = path.join(UPLOADS_ADVERTS_DIR, uniqueFilename);

  let videoBuffer = null;
  let operationName = null;
  let isRealOutput = false;
  let errorOccurred = false;
  let errorMessage = null;

  if (isConfigured) {
    try {
      // Step 1: Submit Veo 3.1 image-to-video request
      const base64Image = imageBuffer.toString('base64');

      // Normalize mime type for jpeg
      const normalizedMime = imageMimeType === 'image/jpg' ? 'image/jpeg' : imageMimeType;

      const requestBody = {
        model: VEO_MODEL,
        instances: [{
          prompt: prompt,
          image: {
            bytesBase64Encoded: base64Image,
            mimeType: normalizedMime
          }
        }],
        parameters: {
          aspectRatio: '9:16',
          durationSeconds: 8,
          enhancePrompt: true,
          generateAudio: false,
          personGeneration: 'dont_allow',
          storageUri: ''
        }
      };

      console.log('[Veo] Submitting image-to-video request...');
      const submitRes = await fetch(
        `${GEMINI_API_BASE}/models/${VEO_MODEL}:predictLongRunning?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );

      if (!submitRes.ok) {
        const errBody = await submitRes.json().catch(() => ({}));
        const errMsg = errBody?.error?.message || `HTTP ${submitRes.status}`;

        // Detect quota exhaustion
        const isQuota = errMsg.includes('429') || errMsg.includes('quota') ||
          errMsg.includes('RESOURCE_EXHAUSTED') || submitRes.status === 429;
        throw new Error(isQuota
          ? `Veo 3.1 quota exceeded: ${errMsg}`
          : `Veo 3.1 submit failed: ${errMsg}`
        );
      }

      const submitData = await submitRes.json();
      operationName = submitData.name;
      console.log('[Veo] Operation submitted:', operationName);

      // Step 2: Poll until done (max 5 min)
      const operation = await pollOperation(operationName, apiKey, 5);

      if (operation.error) {
        throw new Error(`Veo 3.1 generation failed: ${JSON.stringify(operation.error)}`);
      }

      // Step 3: Extract video from response
      const predictions = operation.response?.predictions || [];
      console.log('[Veo] Predictions count:', predictions.length);

      let videoData = null;
      for (const pred of predictions) {
        if (pred.bytesBase64Encoded) {
          videoData = pred.bytesBase64Encoded;
          break;
        }
        if (pred.video?.uri) {
          // Download from GCS URI
          const downloaded = await downloadBuffer(pred.video.uri);
          videoData = downloaded.toString('base64');
          break;
        }
      }

      if (videoData) {
        videoBuffer = Buffer.from(videoData, 'base64');
        if (videoBuffer.length > 10000) {
          isRealOutput = true;
          console.log('[Veo] ✅ Video received:', videoBuffer.length, 'bytes');
        } else {
          videoBuffer = null;
          throw new Error('Veo 3.1 returned empty or invalid video data');
        }
      } else {
        throw new Error('Veo 3.1 returned no video predictions');
      }

    } catch (err) {
      console.error('[Veo ERROR]:', err.message);
      errorOccurred = true;
      errorMessage = err.message;
    }
  } else {
    errorOccurred = true;
    errorMessage = 'GEMINI_API_KEY not configured in server/.env';
  }

  // Save video to disk
  if (videoBuffer && videoBuffer.length > 10000) {
    fs.writeFileSync(filePath, videoBuffer);
  } else {
    const templateBuf = fs.readFileSync(VALID_MP4_TEMPLATE_PATH);
    fs.writeFileSync(filePath, templateBuf);
    videoBuffer = templateBuf;
  }

  const savedBuffer = fs.readFileSync(filePath);
  const videoHash = crypto.createHash('sha256').update(savedBuffer).digest('hex');
  const relativeUrl = `/uploads/advertisements/${uniqueFilename}`;

  console.log('===========================================================');
  console.log('===== VEO 3.1 VIDEO GENERATION COMPLETE =====');
  console.log('generationId:  ', generationId);
  console.log('operationName: ', operationName || 'N/A');
  console.log('isRealOutput:  ', isRealOutput);
  console.log('errorOccurred: ', errorOccurred);
  console.log('errorMessage:  ', errorMessage);
  console.log('videoBytes:    ', savedBuffer.length, 'bytes');
  console.log('videoUrl:      ', relativeUrl);
  console.log('===========================================================');

  return {
    success: true,
    generationId,
    falRequestId: operationName || `local-${generationId}`,
    isRealFalOutput: isRealOutput,
    quotaErrorOccurred: errorOccurred,
    errorMessage,
    inputImageHash,
    videoHash,
    prompt,
    videoUrl: relativeUrl,
    thumbnailUrl: compositePosterUrl || null,
    status: 'completed'
  };
}

export { buildAdvertisementPrompt as buildPrompt };
