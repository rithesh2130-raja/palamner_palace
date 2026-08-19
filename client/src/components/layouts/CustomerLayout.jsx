import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header.jsx';
import { MainNavigation } from '../common/MainNavigation.jsx';
import { MobileNavigation } from '../common/MobileNavigation.jsx';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black pb-16 md:pb-0">
      <Header />
      <MainNavigation />
      
      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      {/* Black Premium Footer */}
      <footer className="bg-black text-neutral-400 border-t border-neutral-800 py-10 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-extrabold text-white text-sm tracking-wide">
            PALAMNER<span className="text-[#E50914]">PALACE</span> — Social Commerce Marketplace
          </p>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Discover authentic handwoven silks, regional handicrafts, electronics, and short-video shoppable reels. Powered by pure MERN stack and AI video generation.
          </p>
          <p className="text-neutral-500">© 2026 PalamnerPalace Inc. All rights reserved.</p>
        </div>
      </footer>

      <MobileNavigation />
    </div>
  );
};
