import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CustomerLayout } from '../components/layouts/CustomerLayout.jsx';
import { CreatorLayout } from '../components/layouts/CreatorLayout.jsx';
import { AdminLayout } from '../components/layouts/AdminLayout.jsx';

import { HomePage } from '../pages/customer/HomePage.jsx';
import { ProductsPage } from '../pages/customer/ProductsPage.jsx';
import { ProductDetailsPage } from '../pages/customer/ProductDetailsPage.jsx';
import { CategoriesPage } from '../pages/customer/CategoriesPage.jsx';
import { DealsPage } from '../pages/customer/DealsPage.jsx';
import { ReelsPage } from '../pages/customer/ReelsPage.jsx';
import { CartPage } from '../pages/customer/CartPage.jsx';
import { WishlistPage } from '../pages/customer/WishlistPage.jsx';
import { OrdersPage } from '../pages/customer/OrdersPage.jsx';
import { AccountPage } from '../pages/customer/AccountPage.jsx';
import { NotFoundPage } from '../pages/customer/NotFoundPage.jsx';
import { PlaceholderPage } from '../pages/common/PlaceholderPage.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:category" element={<ProductsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="profile" element={<AccountPage />} />
        <Route path="search" element={<ProductsPage />} />
        <Route path="login" element={<AccountPage />} />
        <Route path="register" element={<AccountPage />} />
        <Route path="404" element={<NotFoundPage />} />
      </Route>

      {/* Creator Routes */}
      <Route path="/creator" element={<CreatorLayout />}>
        <Route path="studio" element={<PlaceholderPage title="Creator Video Upload Studio" dayPlanned="Day 15" />} />
        <Route path="analytics" element={<PlaceholderPage title="Creator Affiliate Analytics" dayPlanned="Day 16" />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<PlaceholderPage title="Executive Admin Dashboard" dayPlanned="Day 17" />} />
        <Route path="products" element={<PlaceholderPage title="Admin Product Catalog" dayPlanned="Day 17" />} />
        <Route path="orders" element={<PlaceholderPage title="Admin Order Fulfillment" dayPlanned="Day 17" />} />
        <Route path="customers" element={<PlaceholderPage title="Admin User Management" dayPlanned="Day 17" />} />
        <Route path="creators" element={<PlaceholderPage title="Admin Creator Verification" dayPlanned="Day 17" />} />
        <Route path="reels" element={<PlaceholderPage title="Admin Reel Moderation" dayPlanned="Day 17" />} />
        <Route path="analytics" element={<PlaceholderPage title="Admin Platform Analytics" dayPlanned="Day 17" />} />
        <Route path="settings" element={<PlaceholderPage title="Admin System Settings" dayPlanned="Day 17" />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<CustomerLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
