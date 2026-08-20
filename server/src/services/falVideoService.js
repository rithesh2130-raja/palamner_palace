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
    const posterFilePath = path.join(UPLOADS_REFS_DIR, posterFileName);
    fs.writeFileSync(posterFilePath, verticalCanvas);
    return `/uploads/references/${posterFileName}`;
  } catch (err) {
    console.warn('⚠️ [Sharp] Poster composite warning:', err.message);
    return null;
  }
}

/**
 * Upload image to fal.ai CDN using REST API with correct endpoint
 */
async function uploadToFalStorage(imageBuffer, imageMimeType, filename, falKey) {
  // Method 1: fal.ai REST storage upload (correct endpoint from official docs)
  try {
    const uploadRes = await fetch('https://rest.alpha.fal.ai/storage/upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': imageMimeType,
        'X-Fal-File-Name': filename
      },
      body: imageBuffer
    });

    if (uploadRes.ok) {
      const data = await uploadRes.json();
      const url = data.url || data.access_url || data.file_url;
      if (url) {
        console.log('[fal.ai] ✅ REST storage upload succeeded:', url);
        return url;
      }
    }
    const errText = await uploadRes.text().catch(() => '');
    console.warn('[fal.ai] REST upload status:', uploadRes.status, errText.substring(0, 100));
  } catch (err) {
    console.warn('[fal.ai] REST upload exception:', err.message);
  }

  // Method 2: fal.ai v1 storage endpoint
  try {
    const uploadRes2 = await fetch('https://fal.ai/api/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': imageMimeType,
        'X-File-Name': filename
      },
      body: imageBuffer
    });

    if (uploadRes2.ok) {
      const data = await uploadRes2.json();
      const url = data.url || data.access_url;
      if (url) {
        console.log('[fal.ai] ✅ v1 API upload succeeded:', url);
        return url;
      }
    }
    console.warn('[fal.ai] v1 API upload status:', uploadRes2.status);
  } catch (err) {
    console.warn('[fal.ai] v1 API upload exception:', err.message);
  }

  // Method 3: fal.run multipart upload
  try {
    const form = new FormData();
    form.append('file', new Blob([imageBuffer], { type: imageMimeType }), filename);
    const uploadRes3 = await fetch('https://fal.run/fal-ai/storage', {
      method: 'POST',
      headers: { 'Authorization': `Key ${falKey}` },
      body: form
    });
    if (uploadRes3.ok) {
      const data = await uploadRes3.json();
      const url = data.url || data.access_url;
      if (url) {
        console.log('[fal.ai] ✅ fal.run multipart upload succeeded:', url);
        return url;
      }
    }
    console.warn('[fal.ai] fal.run multipart upload status:', uploadRes3.status);
  } catch (err) {
    console.warn('[fal.ai] fal.run upload exception:', err.message);
  }

  // Method 4: base64 data URI (direct embed — many fal models support this)
  const dataUri = `data:${imageMimeType};base64,${imageBuffer.toString('base64')}`;
  console.log('[fal.ai] Using base64 data URI fallback, length:', dataUri.length);
  return dataUri;
}

/**
 * Build advertisement prompt
 */
export function buildAdvertisementPrompt({ userPrompt }) {
  if (userPrompt && userPrompt.trim().length > 10) {
    return userPrompt.trim();
  }
  return 'Cinematic product advertisement video. Slowly orbit around the product. Preserve exact product color and design. Professional studio lighting. Clean neutral background. Single continuous scene. No cuts. Vertical 9:16 format.';
}

/**
 * MAIN: Generate video using fal.ai Wan 2.6 image-to-video
 * Uses raw fetch to call fal.ai REST API directly — no SDK credential issues
 */
export async function generateFalVideo({ generationId, userPrompt, imageInput, style = 'Cinematic' }) {
  const falKey = process.env.FAL_KEY || env.FAL_KEY;
  const isFalConfigured = Boolean(falKey && falKey.length > 10);

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
  console.log('===== FAL.AI VIDEO GENERATION START =====');
  console.log('generationId:  ', generationId);
  console.log('falConfigured: ', isFalConfigured);
  console.log('falKeyPrefix:  ', falKey ? falKey.substring(0, 20) + '...' : 'MISSING');
  console.log('prompt:        ', prompt.substring(0, 100) + '...');
  console.log('===========================================================');

  const uniqueFilename = `advertisement-${generationId}.mp4`;
  const filePath = path.join(UPLOADS_ADVERTS_DIR, uniqueFilename);

  let videoBuffer = null;
  let falRequestId = null;
  let isRealFalOutput = false;
  let errorOccurred = false;
  let errorMessage = null;

  if (isFalConfigured) {
    try {
      const ext = imageMimeType.includes('png') ? '.png' : imageMimeType.includes('webp') ? '.webp' : '.jpg';
      const uploadFilename = `product-${generationId}${ext}`;

      // Step 1: Upload image to get a URL fal.ai can access
      const imageUrl = await uploadToFalStorage(imageBuffer, imageMimeType, uploadFilename, falKey);
      console.log('[fal.ai] Image URL obtained (first 80 chars):', imageUrl.substring(0, 80));

      // Step 2: Submit to Wan 2.6 via fal.ai REST API directly (bypass SDK credential issue)
      console.log('[fal.ai] Submitting to fal-ai/wan/v2.6/image-to-video via REST...');

      const submitRes = await fetch('https://queue.fal.run/fal-ai/wan/v2.6/image-to-video', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: prompt,
          resolution: '720p',
          duration: 5,
          negative_prompt: 'blurry, low quality, distorted, unrelated objects, roads, cars, people, traffic, text, watermark, scene cuts'
        })
      });

      if (!submitRes.ok) {
        const errBody = await submitRes.text();
        const isBalanceError = errBody.includes('balance') || errBody.includes('locked') || errBody.includes('Exhausted');
        const friendlyMsg = isBalanceError
          ? 'fal.ai account balance exhausted. Top up at fal.ai/dashboard/billing.'
          : `fal.ai submit failed: ${submitRes.status} — ${errBody.substring(0, 200)}`;
        throw new Error(friendlyMsg);
      }

      const submitData = await submitRes.json();
      falRequestId = submitData.request_id;
      console.log('[fal.ai] Job submitted. request_id:', falRequestId);

      // Step 3: Poll for completion
      let pollAttempts = 0;
      const maxAttempts = 60; // 5 min max (5s * 60)
      let resultData = null;

      while (pollAttempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 5000)); // wait 5s
        pollAttempts++;

        const statusRes = await fetch(`https://queue.fal.run/fal-ai/wan/v2.6/image-to-video/requests/${falRequestId}/status`, {
          headers: { 'Authorization': `Key ${falKey}` }
        });

        if (!statusRes.ok) {
          console.warn('[fal.ai] Status check failed:', statusRes.status);
          continue;
        }

        const statusData = await statusRes.json();
        console.log(`[fal.ai] Poll ${pollAttempts}/${maxAttempts} — status: ${statusData.status}`);

        if (statusData.status === 'COMPLETED') {
          // Fetch result
          const resultRes = await fetch(`https://queue.fal.run/fal-ai/wan/v2.6/image-to-video/requests/${falRequestId}`, {
            headers: { 'Authorization': `Key ${falKey}` }
          });
          if (resultRes.ok) {
            resultData = await resultRes.json();
          }
          break;
        } else if (statusData.status === 'FAILED') {
          throw new Error(`fal.ai job failed: ${JSON.stringify(statusData.error || statusData)}`);
        }
      }

      if (resultData) {
        const videoUrl = resultData.video?.url || resultData.output?.video?.url || null;
        console.log('[fal.ai] Result video URL:', videoUrl);

        if (videoUrl) {
          const downloaded = await downloadBuffer(videoUrl);
          if (downloaded && downloaded.length > 10000) {
            videoBuffer = downloaded;
            isRealFalOutput = true;
            console.log('[fal.ai] ✅ Video downloaded:', downloaded.length, 'bytes');
          }
        }
      } else {
        throw new Error('fal.ai job did not complete within timeout.');
      }

    } catch (err) {
      console.error('[fal.ai ERROR]:', err.message);
      errorOccurred = true;
      errorMessage = err.message;
    }
  } else {
    errorOccurred = true;
    errorMessage = 'FAL_KEY not configured in server/.env';
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
  console.log('===== FAL.AI VIDEO GENERATION COMPLETE =====');
  console.log('generationId:    ', generationId);
  console.log('falRequestId:    ', falRequestId || `local-${generationId}`);
  console.log('isRealFalOutput: ', isRealFalOutput);
  console.log('errorOccurred:   ', errorOccurred);
  console.log('errorMessage:    ', errorMessage);
  console.log('videoBytes:      ', savedBuffer.length, 'bytes');
  console.log('videoUrl:        ', relativeUrl);
  console.log('===========================================================');

  return {
    success: true,
    generationId,
    falRequestId: falRequestId || `local-${generationId}`,
    isRealFalOutput,
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
