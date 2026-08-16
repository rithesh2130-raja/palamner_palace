import assert from 'assert';

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- Starting API Integration Tests for plmnermart ---');
  let passCount = 0;
  let failCount = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passCount++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
      failCount++;
    }
  };

  // Test 1: Get Products List
  await test('GET /api/products returns items', async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    assert.strictEqual(res.status, 200, 'Status should be 200');
    const data = await res.json();
    assert(Array.isArray(data), 'Response should be an array');
    assert(data.length > 0, 'Catalog should contain items');
    assert(data.every(p => p.name && p.price), 'Products should have names and prices');
  });

  // Test 2: Get Store Settings
  await test('GET /api/settings returns rebranded store configurations', async () => {
    const res = await fetch(`${BASE_URL}/api/settings`);
    assert.strictEqual(res.status, 200, 'Status should be 200');
    const data = await res.json();
    assert.strictEqual(data.storeName, 'ShopSphere', 'Store name should be ShopSphere');
    assert.strictEqual(data.currency, 'USD', 'Currency should be USD');
  });

  // Test 3: Log In Admin User
  let adminCookie = '';
  await test('POST /api/users/login with valid admin credentials succeeds', async () => {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@email.com', password: 'password123' }),
    });
    assert.strictEqual(res.status, 200, 'Login status should be 200');
    const data = await res.json();
    assert.strictEqual(data.email, 'admin@email.com');
    assert.strictEqual(data.role, 'SuperAdmin');
    assert.strictEqual(data.isAdmin, true);

    const cookies = res.headers.get('set-cookie');
    if (cookies) {
      adminCookie = cookies.split(';')[0];
    }
  });

  // Test 4: Access Protected Sellers Directory
  await test('GET /api/sellers with admin cookie returns list', async () => {
    const headers = {};
    if (adminCookie) {
      headers['Cookie'] = adminCookie;
    }
    const res = await fetch(`${BASE_URL}/api/sellers`, { headers });
    assert.strictEqual(res.status, 200, 'Protected route status should be 200');
    const data = await res.json();
    assert(Array.isArray(data), 'Sellers should be returned as an array');
  });

  console.log('\n--- Test Execution Summary ---');
  console.log(`Total Passed: ${passCount}`);
  console.log(`Total Failed: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
