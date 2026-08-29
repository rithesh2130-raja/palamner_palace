import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../components/layouts/CustomerLayout.jsx";
import CreatorLayout from "../components/layouts/CreatorLayout.jsx";
import AdminLayout from "../components/layouts/AdminLayout.jsx";
import HomePage from "../pages/customer/HomePage.jsx";
import ProductsPage from "../pages/products/ProductsPage.jsx";
import CategoryPage from "../pages/category/CategoryPage.jsx";
import ProductDetailsPage from "../pages/products/ProductDetailsPage.jsx";
import CartPage from "../pages/customer/CartPage.jsx";
import WishlistPage from "../pages/customer/WishlistPage.jsx";
import ReelsPage from "../pages/customer/ReelsPage.jsx";
import PlaceholderPage from "../pages/common/PlaceholderPage.jsx";
import NotFoundPage from "../pages/customer/NotFoundPage.jsx";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Routes (CustomerLayout) */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailsPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="categories" element={<ProductsPage />} />
        <Route path="categories/:category" element={<CategoryPage />} />
        <Route
          path="cart"
          element={<PlaceholderPage title="Shopping Cart" dayPlanned="Day 8" />}
        />
        <Route
          path="checkout"
          element={
            <PlaceholderPage title="Checkout Engine" dayPlanned="Day 9" />
          }
        />
        <Route
          path="orders"
          element={
            <PlaceholderPage title="Orders & Tracking" dayPlanned="Day 10" />
          }
        />
        <Route
          path="profile"
          element={
            <PlaceholderPage title="User Account Profile" dayPlanned="Day 2" />
          }
        />
        <Route
          path="creator/:username"
          element={
            <PlaceholderPage
              title="Creator Profile Showcase"
              dayPlanned="Day 15"
            />
          }
        />
      </Route>

      {/* Creator Routes (CreatorLayout) */}
      <Route path="/creator" element={<CreatorLayout />}>
        <Route
          path="studio"
          element={
            <PlaceholderPage
              title="Creator Video Upload Studio"
              dayPlanned="Day 15"
            />
          }
        />
        <Route
          path="analytics"
          element={
            <PlaceholderPage
              title="Creator Affiliate Analytics"
              dayPlanned="Day 16"
            />
          }
        />
      </Route>

      {/* Admin Routes (AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <PlaceholderPage
              title="Executive Admin Dashboard"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="products"
          element={
            <PlaceholderPage
              title="Admin Product Catalog"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="orders"
          element={
            <PlaceholderPage
              title="Admin Order Fulfillment"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="customers"
          element={
            <PlaceholderPage
              title="Admin User Management"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="creators"
          element={
            <PlaceholderPage
              title="Admin Creator Verification"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="reels"
          element={
            <PlaceholderPage
              title="Admin Reel Moderation"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="analytics"
          element={
            <PlaceholderPage
              title="Admin Platform Analytics"
              dayPlanned="Day 17"
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Admin System Settings"
              dayPlanned="Day 17"
            />
          }
        />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route
        path="*"
        element={
          <PlaceholderPage title="404 — Page Not Found" dayPlanned="N/A" />
        }
      />
    </Routes>
  );
};
