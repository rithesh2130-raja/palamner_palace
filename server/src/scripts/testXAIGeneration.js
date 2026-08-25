import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function runXAITest() {
  const apiKey = process.env.XAI_API_KEY;
  const baseUrl = process.env.XAI_VIDEO_BASE_URL || 'https://api.x.ai/v1';
  const model = process.env.XAI_VIDEO_MODEL || 'grok-imagine-video-1.5';

  console.log('\n======================================================');
  console.log('       xAI Grok Imagine Video Integration Test        ');
  console.log('======================================================\n');
  console.log(`[xAI] Target API Base URL: ${baseUrl}`);
  console.log(`[xAI] Model Name:         ${model}`);
  console.log(`[xAI] API Key Configured:  ${apiKey ? 'YES (Length: ' + apiKey.length + ')' : 'NO'}`);

  if (!apiKey || apiKey.includes('placeholder')) {
    console.error('\n[xAI ERROR] XAI_API_KEY is missing or set to placeholder in server/.env.');
    console.error('[xAI ERROR] Please add your valid xAI API key to server/.env to run live generations.\n');
    process.exit(1);
  }

  const prompt = 'A cinematic close-up of a premium gaming mouse rotating slowly on a futuristic gaming desk with subtle RGB lighting.';

  const payload = {
    model,
    prompt,
    duration: 5,
    aspect_ratio: '9:16',
    resolution: '720p',
  };

  console.log('\n[xAI] Dispatching POST /v1/videos/generations...');
  console.log(`[xAI] Payload: ${JSON.stringify(payload, null, 2)}`);

  try {
    const res = await fetch(`${baseUrl}/videos/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`\n[xAI ERROR] HTTP ${res.status} ${res.statusText}`);
      console.error(`[xAI ERROR] Response: ${errText}\n`);
      process.exit(1);
    }

    const data = await res.json();
    const requestId = data.request_id || data.id;

    if (!requestId) {
      console.error('\n[xAI ERROR] xAI response did not include a valid request_id!');
      console.dir(data);
      process.exit(1);
    }

    console.log(`\n[xAI SUCCESS] Generation Request Accepted!`);
    console.log(`[xAI] Request ID: ${requestId}`);

    // Poll status loop
    let isCompleted = false;
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes max at 5s interval

    while (!isCompleted && attempts < maxAttempts) {
      attempts++;
      console.log(`[xAI] Polling GET /v1/videos/${requestId} (Attempt ${attempts})...`);

      const pollRes = await fetch(`${baseUrl}/videos/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!pollRes.ok) {
        console.error(`[xAI WARNING] Poll request failed with HTTP ${pollRes.status}`);
      } else {
        const pollData = await pollRes.json();
        const status = (pollData.status || pollData.state || '').toLowerCase();
        console.log(`[xAI] Current Status: ${status}`);

        if (status === 'done' || status === 'completed' || status === 'succeeded' || pollData.video?.url || pollData.video_url) {
          isCompleted = true;
          const videoUrl = pollData.video?.url || pollData.video_url || pollData.url;
          console.log('\n======================================================');
          console.log('       xAI VIDEO GENERATION COMPLETED SUCCESSFULLY    ');
          console.log('======================================================');
          console.log(`[xAI] Request ID: ${requestId}`);
          console.log(`[xAI] Status:     COMPLETED (done)`);
          console.log(`[xAI] Video URL:  ${videoUrl}\n`);
          process.exit(0);
        } else if (status === 'failed' || status === 'error' || status === 'expired') {
          console.error(`\n[xAI ERROR] Generation failed on provider side. Status: ${status}`);
          console.dir(pollData);
          process.exit(1);
        }
      }

      // Wait 5 seconds before next poll
      await new Promise((r) => setTimeout(r, 5000));
    }

    console.error('\n[xAI TIMEOUT] Reached maximum polling attempts (10 minutes).');
    process.exit(1);
  } catch (err) {
    console.error('\n[xAI EXCEPTION] Network error connecting to xAI API:', err);
    process.exit(1);
  }
}

runXAITest();
