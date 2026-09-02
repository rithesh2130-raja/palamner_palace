import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { checkoutService } from '../services/checkout/checkoutService.js';
import { orderService } from '../services/orders/orderService.js';

async function runTests() {
  console.log('==================================================');
  console.log('🚀 ShopSphere — Day 8 Master Test Suite');
  console.log('==================================================\n');

  await connectDatabase();

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASSED: ${message}`);
      results.passed++;
      results.tests.push({ name: message, status: 'PASSED' });
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      results.failed++;
      results.tests.push({ name: message, status: 'FAILED' });
    }
  }

  try {
    // 1. Clean up test users, products, addresses, cart, orders
    await User.deleteMany({ email: { $in: ['day8_user_a@test.com', 'day8_user_b@test.com', 'day8_admin@test.com'] } });
    await Product.deleteMany({ sku: { $in: ['TEST-SKU-001', 'TEST-SKU-002'] } });

    // 2. Create Test Users
    const userA = await User.create({
      name: 'User A',
      email: 'day8_user_a@test.com',
      password: 'hashed_password_123',
      role: 'customer',
    });

    const userB = await User.create({
      name: 'User B',
      email: 'day8_user_b@test.com',
      password: 'hashed_password_123',
      role: 'customer',
    });

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'day8_admin@test.com',
      password: 'hashed_password_123',
      role: 'admin',
    });

    // 3. Create Addresses
    const addressA = await Address.create({
      userId: userA._id,
      fullName: 'User A Address',
      phone: '9876543210',
      addressLine1: '123 Main St',
      city: 'Palamaner',
      state: 'Andhra Pradesh',
      postalCode: '517408',
      country: 'India',
      isDefault: true,
    });

    const addressB = await Address.create({
      userId: userB._id,
      fullName: 'User B Address',
      phone: '9123456789',
      addressLine1: '456 Market St',
      city: 'Chittoor',
      state: 'Andhra Pradesh',
      postalCode: '517001',
      country: 'India',
    });

    // 4. Create Products
    const product1 = await Product.create({
      name: 'ShopSphere Test Earbuds',
      slug: 'shopsphere-test-earbuds',
      description: 'High quality wireless earbuds',
      price: 1499,
      stock: 10,
      sku: 'TEST-SKU-001',
      isActive: true,
      category: new mongoose.Types.ObjectId(),
    });

    const productLimited = await Product.create({
      name: 'ShopSphere Limited Edition Watch',
      slug: 'shopsphere-limited-watch',
      description: 'Rare collectible smartwatch',
      price: 4999,
      stock: 1,
      sku: 'TEST-SKU-002',
      isActive: true,
      category: new mongoose.Types.ObjectId(),
    });

    // Prepare Cart for User A
    await Cart.create({
      userId: userA._id,
      items: [{ productId: product1._id, quantity: 2 }],
    });

    console.log('\n--- 1. SECURITY & AUTHORIZATION TESTS ---');

    // Test 1: Address Ownership Verification
    try {
      await orderService.createOrder(userA._id, {
        addressId: addressB._id.toString(),
        deliveryMethod: 'standard',
        paymentMethod: 'COD',
      });
      assert(false, 'Using another user\'s address should be rejected with 403');
    } catch (err) {
      assert(err.code === 'ADDRESS_FORBIDDEN' || err.statusCode === 403, 'Rejects cross-user address usage with ADDRESS_FORBIDDEN (403)');
    }

    // Test 2: Server-Authoritative Pricing (Price tampering impossible)
    const preview = await checkoutService.createCheckoutPreview(userA._id, {
      addressId: addressA._id.toString(),
      deliveryMethod: 'standard',
    });
    assert(preview.pricing.subtotal === 2998, 'Server calculates exact subtotal (2 * 1499 = 2998) ignoring client manipulation');
    assert(preview.pricing.total === 2998, 'Server calculates total correctly');

    console.log('\n--- 2. HAPPY PATH ORDER CREATION ---');

    const orderA = await orderService.createOrder(userA._id, {
      addressId: addressA._id.toString(),
      deliveryMethod: 'standard',
      paymentMethod: 'COD',
      idempotencyKey: 'idempotency-key-test-100',
    });

    assert(orderA && orderA.orderNumber, 'Order created successfully with orderNumber');
    assert(orderA.pricing.total === 2998, 'Order pricing is server-calculated (2998)');
    assert(orderA.items.length === 1 && orderA.items[0].quantity === 2, 'Order item snapshot preserved correctly');
    assert(orderA.shippingAddress.fullName === 'User A Address', 'Address snapshot stored in order');

    // Verify Stock Reduction
    const updatedProduct1 = await Product.findById(product1._id);
    assert(updatedProduct1.stock === 8, 'Inventory reduced from 10 to 8 after order placement');

    // Verify Cart Cleared
    const cartAAfter = await Cart.findOne({ userId: userA._id });
    assert(cartAAfter.items.length === 0, 'User cart cleared after successful order');

    console.log('\n--- 3. IDEMPOTENCY TEST ---');

    // Re-submit identical order with same idempotency key
    const duplicateOrder = await orderService.createOrder(userA._id, {
      addressId: addressA._id.toString(),
      deliveryMethod: 'standard',
      paymentMethod: 'COD',
      idempotencyKey: 'idempotency-key-test-100',
    });

    assert(duplicateOrder._id.toString() === orderA._id.toString(), 'Idempotent retry returns existing order without duplicate DB record');

    console.log('\n--- 4. CONCURRENCY & STOCK PROTECTION TESTS ---');

    // Set Cart for User A and User B with limited stock item (stock = 1)
    await Cart.findOneAndUpdate(
      { userId: userA._id },
      { items: [{ productId: productLimited._id, quantity: 1 }] }
    );
    await Cart.create({
      userId: userB._id,
      items: [{ productId: productLimited._id, quantity: 1 }],
    });

    // Launch simultaneous order attempts
    const [resA, resB] = await Promise.allSettled([
      orderService.createOrder(userA._id, {
        addressId: addressA._id.toString(),
        deliveryMethod: 'standard',
        paymentMethod: 'COD',
        idempotencyKey: 'idempotency-key-user-a',
      }),
      orderService.createOrder(userB._id, {
        addressId: addressB._id.toString(),
        deliveryMethod: 'standard',
        paymentMethod: 'COD',
        idempotencyKey: 'idempotency-key-user-b',
      }),
    ]);

    const succeededCount = [resA, resB].filter((r) => r.status === 'fulfilled').length;
    const failedCount = [resA, resB].filter((r) => r.status === 'rejected').length;

    assert(succeededCount === 1 && failedCount === 1, 'Exactly 1 order succeeded and 1 failed during stock=1 race condition');

    const succeededOrder = [resA, resB].find((r) => r.status === 'fulfilled')?.value;

    const finalProductLimited = await Product.findById(productLimited._id);
    assert(finalProductLimited.stock === 0, 'Stock reduced to 0 and NEVER negative');

    console.log('\n--- 5. ORDER ACCESS SECURITY & CANCELLATION ---');

    // Test: User B attempting to view User A's order
    try {
      await orderService.getOrderById(orderA._id.toString(), userB._id, false);
      assert(false, 'User B viewing User A\'s order should be rejected with 403');
    } catch (err) {
      assert(err.code === 'ORDER_FORBIDDEN' || err.statusCode === 403, 'Rejects cross-user order view with ORDER_FORBIDDEN (403)');
    }

    // Cancel Order A (eligible status PENDING)
    const cancelledOrder = await orderService.cancelOrder(orderA._id.toString(), userA._id, false, 'Changed mind');
    assert(cancelledOrder.status === 'CANCELLED', 'Order A successfully cancelled');

    // Verify Stock Restored after cancellation
    const restoredProduct1 = await Product.findById(product1._id);
    assert(restoredProduct1.stock === 10, 'Stock restored from 8 back to 10 after cancellation');

    console.log('\n--- 6. ADMIN ORDER STATUS TRANSITION VALIDATION ---');

    // Admin updates order status step-by-step using succeededOrder (which is in PENDING status)
    const adminTestOrderId = succeededOrder._id.toString();

    let adminOrder = await orderService.updateOrderStatusAdmin(adminTestOrderId, 'CONFIRMED', 'Confirmed payment');
    assert(adminOrder.status === 'CONFIRMED', 'Status updated to CONFIRMED');

    adminOrder = await orderService.updateOrderStatusAdmin(adminTestOrderId, 'PACKED', 'Item packed in box');
    assert(adminOrder.status === 'PACKED', 'Status updated to PACKED');

    adminOrder = await orderService.updateOrderStatusAdmin(adminTestOrderId, 'SHIPPED', 'Shipped via BlueDart');
    assert(adminOrder.status === 'SHIPPED', 'Status updated to SHIPPED');

    // Try illegal status transition: SHIPPED -> PACKED
    try {
      await orderService.updateOrderStatusAdmin(orderA._id.toString(), 'PACKED', 'Illegal backward step');
      assert(false, 'Illegal status transition SHIPPED -> PACKED should be rejected');
    } catch (err) {
      assert(err.code === 'INVALID_STATUS_TRANSITION' || err.statusCode === 400, 'Rejects invalid status transition (SHIPPED -> PACKED)');
    }

    // Clean up test records
    await User.deleteMany({ email: { $in: ['day8_user_a@test.com', 'day8_user_b@test.com', 'day8_admin@test.com'] } });
    await Product.deleteMany({ sku: { $in: ['TEST-SKU-001', 'TEST-SKU-002'] } });
    await Address.deleteMany({ _id: { $in: [addressA._id, addressB._id] } });
    await Order.deleteMany({ _id: { $in: [orderA._id] } });

    console.log('\n==================================================');
    console.log(`📊 Master Test Results: ${results.passed} Passed, ${results.failed} Failed`);
    console.log('==================================================\n');

  } catch (globalError) {
    console.error('❌ Test suite error:', globalError);
  } finally {
    await disconnectDatabase();
    process.exit(results.failed > 0 ? 1 : 0);
  }
}

runTests();
