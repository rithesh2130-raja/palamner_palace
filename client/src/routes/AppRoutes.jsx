import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../components/layouts/CustomerLayout.jsx';
import CreatorLayout from '../components/layouts/CreatorLayout.jsx';
import AdminLayout from '../components/layouts/AdminLayout.jsx';

import HomePage from '../pages/customer/HomePage.jsx';
import ReelsPage from '../pages/customer/ReelsPage.jsx';
import ProductsPage from '../pages/products/ProductsPage';
import CategoryPage from '../pages/category/CategoryPage.jsx';
import ProductDetailsPage from '../pages/products/ProductDetailsPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import ProductList from '../pages/admin/products/ProductList';
import ProductCreate from '../pages/admin/products/ProductCreate';
import ProductEdit from '../pages/admin/products/ProductEdit';
import AdminOrdersPage from '../pages/admin/orders/AdminOrdersPage.jsx';
import AdminOrderDetailsPage from '../pages/admin/orders/AdminOrderDetailsPage.jsx';

import AIStudioPage from '../pages/creator/AIStudioPage.jsx';
import AdminAIPage from '../pages/admin/AdminAIPage.jsx';
import PlaceholderPage from '../pages/common/PlaceholderPage.jsx';
import NotFoundPage from '../pages/customer/NotFoundPage.jsx';

import { ProtectedRoute } from '../components/common/ProtectedRoute.jsx';
import { AdminRoute, CreatorRoute } from '../components/common/RoleRoutes.jsx';

import CartPage from '../pages/customer/CartPage.jsx';
import WishlistPage from '../pages/customer/WishlistPage.jsx';
import CheckoutPage from '../pages/checkout/CheckoutPage.jsx';
import OrdersPage from '../pages/customer/OrdersPage.jsx';
import OrderDetailsPage from '../pages/orders/OrderDetailsPage.jsx';
import OrderConfirmationPage from '../pages/orders/OrderConfirmationPage.jsx';

import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import AccountPage from '../pages/account/AccountPage.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Application Shell Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailsPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="categories" element={<ProductsPage />} />
        <Route path="categories/:category" element={<CategoryPage />} />
        <Route path="deals" element={<PlaceholderPage title="Daily Flash Deals & Offers" dayPlanned="Day 4" />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="reels/:reelId" element={<ReelsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="account/*" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="account/profile" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="account/addresses" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="account/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="account/security" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="creator/:username" element={<PlaceholderPage title="Public Creator Profile & Reels" dayPlanned="Day 10" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="404" element={<NotFoundPage />} />
      </Route>

      {/* Creator Studio & AI Reel Creation Routes */}
      <Route path="/creator" element={<CreatorRoute><CreatorLayout /></CreatorRoute>}>
        <Route path="studio" element={<PlaceholderPage title="Creator Studio Overview" dayPlanned="Day 15" />} />
        <Route path="studio/reels" element={<PlaceholderPage title="Creator Video Reels Manager" dayPlanned="Day 15" />} />
        <Route path="studio/create" element={<AIStudioPage />} />
        <Route path="studio/analytics" element={<PlaceholderPage title="Creator Performance & Conversion Analytics" dayPlanned="Day 16" />} />
        <Route path="studio/earnings" element={<PlaceholderPage title="Creator Affiliate Earnings & Payouts" dayPlanned="Day 16" />} />
        <Route path="studio/campaigns" element={<PlaceholderPage title="Brand Sponsorship Campaigns" dayPlanned="Day 16" />} />
        <Route path="studio/settings" element={<PlaceholderPage title="Creator Profile & Channel Settings" dayPlanned="Day 15" />} />
      </Route>

      {/* Admin Application Shell & AI Analytics Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="ai" element={<AdminAIPage />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="categories" element={<PlaceholderPage title="Admin Category Hierarchy Manager" dayPlanned="Day 17" />} />
        <Route path="inventory" element={<PlaceholderPage title="Admin Warehouse & Inventory Control" dayPlanned="Day 17" />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
        <Route path="customers" element={<PlaceholderPage title="Admin Customer Relationship Manager" dayPlanned="Day 17" />} />
        <Route path="sellers" element={<PlaceholderPage title="Admin Seller Onboarding & Payouts" dayPlanned="Day 17" />} />
        <Route path="creators" element={<PlaceholderPage title="Admin Creator Verification & Badging" dayPlanned="Day 17" />} />
        <Route path="reels" element={<PlaceholderPage title="Admin Reel Content Moderation Queue" dayPlanned="Day 17" />} />
        <Route path="moderation" element={<PlaceholderPage title="Admin Flagged Content & Review System" dayPlanned="Day 17" />} />
        <Route path="campaigns" element={<PlaceholderPage title="Admin Platform Sponsorship Campaigns" dayPlanned="Day 17" />} />
        <Route path="affiliate" element={<PlaceholderPage title="Admin Affiliate Commission Rates & Payouts" dayPlanned="Day 17" />} />
        <Route path="payments" element={<PlaceholderPage title="Admin Payment Gateway Operations" dayPlanned="Day 17" />} />
        <Route path="shipping" element={<PlaceholderPage title="Admin Logistics & Shipping Partners" dayPlanned="Day 17" />} />
        <Route path="analytics" element={<PlaceholderPage title="Admin Platform Financial Analytics" dayPlanned="Day 17" />} />
        <Route path="support" element={<PlaceholderPage title="Admin Support Ticket Helpdesk" dayPlanned="Day 17" />} />
        <Route path="users" element={<PlaceholderPage title="Admin Staff Users & RBAC Permissions" dayPlanned="Day 17" />} />
        <Route path="settings" element={<PlaceholderPage title="Admin System Configuration" dayPlanned="Day 17" />} />
        <Route path="audit-logs" element={<PlaceholderPage title="Admin Operational Audit Trail" dayPlanned="Day 17" />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<CustomerLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
