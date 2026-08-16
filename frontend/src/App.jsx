import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import DealsPage from './pages/DealsPage';
import PrimePage from './pages/PrimePage';
import WishlistsPage from './pages/WishlistsPage';
import CustomerServicePage from './pages/CustomerServicePage';

// Social Commerce & Reels Pages
import ReelsPage from './pages/ReelsPage';
import CreatorProfilePage from './pages/creator/CreatorProfilePage';
import CreatorStudioPage from './pages/creator/CreatorStudioPage';
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import ShopSphereAI from './components/ShopSphereAI';
import MobileBottomNav from './components/MobileBottomNav';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import ProductCreatePage from './pages/admin/ProductCreatePage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';
import UserEditPage from './pages/admin/UserEditPage';
import InventoryPage from './pages/admin/InventoryPage';
import SellersPage from './pages/admin/SellersPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage';
import AdminShippingPage from './pages/admin/AdminShippingPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminReelsPage from './pages/admin/AdminReelsPage';
import AdminCreatorsPage from './pages/admin/AdminCreatorsPage';
import AdminAffiliatePage from './pages/admin/AdminAffiliatePage';

// Route Guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '60px' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Customer & Social Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/creator/:username" element={<CreatorProfilePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/prime" element={<PrimePage />} />
            <Route path="/wishlist" element={<WishlistsPage />} />
            <Route path="/help" element={<CustomerServicePage />} />
            <Route path="/support" element={<CustomerServicePage />} />
            <Route path="/orders" element={<ProfilePage />} />
            <Route path="/account" element={<ProfilePage />} />

            {/* Creator & Seller Portal Routes */}
            <Route path="/creator/create" element={<CreatorStudioPage />} />
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />

            {/* Private Customer Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Enterprise Admin Routes */}
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/products" element={<ProductListPage />} />
              <Route path="/admin/productlist" element={<ProductListPage />} />
              <Route path="/admin/products/new" element={<ProductCreatePage />} />
              <Route path="/admin/product/create" element={<ProductCreatePage />} />
              <Route path="/admin/products/:id" element={<ProductEditPage />} />
              <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
              <Route path="/admin/orders" element={<OrderListPage />} />
              <Route path="/admin/orderlist" element={<OrderListPage />} />
              <Route path="/admin/customers" element={<UserListPage />} />
              <Route path="/admin/userlist" element={<UserListPage />} />
              <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
              <Route path="/admin/inventory" element={<InventoryPage />} />
              <Route path="/admin/sellers" element={<SellersPage />} />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} />
              <Route path="/admin/promotions" element={<AdminPromotionsPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              <Route path="/admin/shipping" element={<AdminShippingPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/support" element={<AdminSupportPage />} />
              <Route path="/admin/staff" element={<AdminUsersPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="/admin/reels" element={<AdminReelsPage />} />
              <Route path="/admin/creators" element={<AdminCreatorsPage />} />
              <Route path="/admin/affiliate" element={<AdminAffiliatePage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <ShopSphereAI />
        <MobileBottomNav />
      </div>
    </Router>
  );
}

export default App;
