import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes.jsx';
import { ToastContainer } from './components/ui/ToastContainer.jsx';
import { LocationModal } from './components/common/LocationModal.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ModalProvider } from './context/ModalContext.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <NotificationProvider>
                <ToastProvider>
                  <ModalProvider>
                    <BrowserRouter>
                      <AppRoutes />
                      <ToastContainer />
                      <LocationModal />
                    </BrowserRouter>
                  </ModalProvider>
                </ToastProvider>
              </NotificationProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
