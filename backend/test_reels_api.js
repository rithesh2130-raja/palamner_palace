import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- Starting ShopSphere Social-Commerce Integration Tests ---');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  };

  // Test 1: GET /api/reels/feed
  await test('GET /api/reels/feed returns video Reels with tagged products', async () => {
    const res = await fetch(`${BASE_URL}/api/reels/feed`);
    assert.strictEqual(res.status, 200, 'Status should be 200');
    const data = await res.json();
    assert(Array.isArray(data.reels), 'Response reels should be an array');
    assert(data.reels.length > 0, 'Reels feed should contain video items');
    assert(data.reels[0].videoUrl, 'Reel item should have a videoUrl');
  });

  // Test 2: GET /api/creators/techcreator
  await test('GET /api/creators/techcreator returns creator profile and reels', async () => {
    const res = await fetch(`${BASE_URL}/api/creators/techcreator`);
    assert.strictEqual(res.status, 200, 'Status should be 200');
    const data = await res.json();
    assert(data.user, 'Creator data should include user details');
    assert.strictEqual(data.user.username, 'techcreator', 'Username should match techcreator');
  });

  // Test 3: GET /api/campaigns
  await test('GET /api/campaigns returns seller promotional campaigns', async () => {
    const res = await fetch(`${BASE_URL}/api/campaigns`);
    assert.strictEqual(res.status, 200, 'Status should be 200');
    const data = await res.json();
    assert(Array.isArray(data), 'Campaigns response should be an array');
    assert(data.length > 0, 'Should return active campaigns');
  });

  // Test 4: POST /api/reels/generate-omni
  await test('POST /api/reels/generate-omni generates multimodal Reel script & video', async () => {
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    const products = await productsRes.json();
    assert(products.length > 0, 'Catalog should contain products for AI generation');

    const res = await fetch(`${BASE_URL}/api/reels/generate-omni`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: products[0]._id,
        tone: 'Energetic Unboxing',
      }),
    });
    assert.strictEqual(res.status, 200, 'Status should be 200');
    const data = await res.json();
    assert(data.success, 'Gemini Omni generation should succeed');
    assert(data.generatedReel.videoUrl, 'Generated Reel should include videoUrl');
    assert(data.generatedReel.script, 'Generated Reel should include AI script');
  });

  // Test 5: POST /api/reels (Reel Creation & Database Insertion)
  await test('POST /api/reels creates and saves a new video Reel in MongoDB', async () => {
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    const products = await productsRes.json();

    const res = await fetch(`${BASE_URL}/api/reels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
        caption: 'Test video Reel created via API!',
        category: 'Electronics',
        hashtags: ['Test', 'ShopSphere'],
        productIds: [products[0]._id],
      }),
    });

    assert.strictEqual(res.status, 201, 'Status should be 201 Created');
    const createdReel = await res.json();
    assert(createdReel._id, 'Created Reel should have an _id');
    assert.strictEqual(createdReel.caption, 'Test video Reel created via API!');
    assert(createdReel.creator, 'Created Reel should have populated creator');
  });

  console.log('\n--- Test Execution Summary ---');
  console.log(`Total Passed: ${passed}`);
  console.log(`Total Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests();
