import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../common/Header";

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium">
            ShopSphere — Social Commerce Marketplace Foundation Architecture
          </p>
          <p className="mt-1 text-slate-500">
            © 2026 ShopSphere Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
