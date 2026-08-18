import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header.jsx';
import { MainNavigation } from '../common/MainNavigation.jsx';
import { MobileNavigation } from '../common/MobileNavigation.jsx';
import { LocationModal } from '../common/LocationModal.jsx';
import { ToastContainer } from '../ui/ToastContainer.jsx';

import { AuthProvider } from '../../context/AuthContext.jsx';
import { CartProvider } from '../../context/CartContext.jsx';
import { WishlistProvider } from '../../context/WishlistContext.jsx';
import { LocationProvider } from '../../context/LocationContext.jsx';
import { NotificationProvider } from '../../context/NotificationContext.jsx';
import { ToastProvider } from '../../context/ToastContext.jsx';
import { ModalProvider } from '../../context/ModalContext.jsx';

export const CustomerLayout = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <ToastProvider>
                <ModalProvider>
                  <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 pb-16 md:pb-0">
                    <Header />
                    <MainNavigation />
                    
                    <main className="flex-1">
                      <Outlet />
                    </main>

                    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 text-center text-xs">
                      <div className="max-w-7xl mx-auto px-4 space-y-3">
                        <p className="font-bold text-slate-200">
                          PALAMNERPALACE — Pure MERN Stack Social Commerce Marketplace
                        </p>
                        <p className="text-slate-500 max-w-xl mx-auto">
                          Built with MongoDB, Express.js, React.js, and Node.js. Discover authentic products, artisan handicrafts, and interactive short-video commerce.
                        </p>
                        <p className="text-slate-600">© 2026 PalamnerPalace Inc. All rights reserved.</p>
                      </div>
                    </footer>

                    <MobileNavigation />
                    <LocationModal />
                    <ToastContainer />
                  </div>
                </ModalProvider>
              </ToastProvider>
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
};
