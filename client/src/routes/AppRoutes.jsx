import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '../components/layouts/CustomerLayout.jsx';
import CreatorLayout from '../components/layouts/CreatorLayout.jsx';
import AdminLayout from '../components/layouts/AdminLayout.jsx';

import HomePage from '../pages/customer/HomePage.jsx';
import ReelsPage from '../pages/customer/ReelsPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AIStudioPage from '../pages/creator/AIStudioPage.jsx';
import AdminAIPage from '../pages/admin/AdminAIPage.jsx';
import PlaceholderPage from '../pages/common/PlaceholderPage.jsx';
import NotFoundPage from '../pages/customer/NotFoundPage.jsx';

import { ProtectedRoute } from '../components/common/ProtectedRoute.jsx';
import { AdminRoute, CreatorRoute } from '../components/common/RoleRoutes.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Application Shell Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<PlaceholderPage title="Marketplace Search Results" dayPlanned="Day 5" />} />
        <Route path="products" element={<PlaceholderPage title="Product Catalog Grid" dayPlanned="Day 4" />} />
        <Route path="product/:productId" element={<PlaceholderPage title="Product Details Page" dayPlanned="Day 4" />} />
        <Route path="category/:categoryId" element={<PlaceholderPage title="Category Filtered Catalog" dayPlanned="Day 4" />} />
        <Route path="categories" element={<PlaceholderPage title="All Product Categories" dayPlanned="Day 4" />} />
        <Route path="categories/:category" element={<PlaceholderPage title="Category Products" dayPlanned="Day 4" />} />
        <Route path="deals" element={<PlaceholderPage title="Daily Flash Deals & Offers" dayPlanned="Day 4" />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="reels/:reelId" element={<ReelsPage />} />
        <Route path="cart" element={<PlaceholderPage title="Shopping Cart Drawer & Page" dayPlanned="Day 6" />} />
        <Route path="checkout" element={<PlaceholderPage title="Checkout & Payment Gateway" dayPlanned="Day 7" />} />
        <Route path="orders" element={<PlaceholderPage title="Customer Order History" dayPlanned="Day 8" />} />
        <Route path="orders/:orderId" element={<PlaceholderPage title="Order Tracking & Invoice" dayPlanned="Day 8" />} />
        <Route path="account" element={<PlaceholderPage title="Customer Account Settings" dayPlanned="Day 2" />} />
        <Route path="profile" element={<PlaceholderPage title="Customer Profile & Wishlist" dayPlanned="Day 2" />} />
        <Route path="wishlist" element={<PlaceholderPage title="Customer Saved Wishlist" dayPlanned="Day 6" />} />
        <Route path="creator/:username" element={<PlaceholderPage title="Public Creator Profile & Reels" dayPlanned="Day 10" />} />
        <Route path="login" element={<PlaceholderPage title="Customer Authentication Login" dayPlanned="Day 2" />} />
        <Route path="register" element={<PlaceholderPage title="Customer Registration Sign-Up" dayPlanned="Day 2" />} />
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
        <Route path="products" element={<PlaceholderPage title="Admin Product Catalog Management" dayPlanned="Day 17" />} />
        <Route path="categories" element={<PlaceholderPage title="Admin Category Hierarchy Manager" dayPlanned="Day 17" />} />
        <Route path="inventory" element={<PlaceholderPage title="Admin Warehouse & Inventory Control" dayPlanned="Day 17" />} />
        <Route path="orders" element={<PlaceholderPage title="Admin Order Fulfillment & Logistics" dayPlanned="Day 17" />} />
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
