import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { User, MapPin, Package, Heart, Bell, Shield, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Link } from 'react-router-dom';

export const AccountPage = () => {
  const { user, isLoggedIn, logout, toggleAuth } = useAuth();
  const { location } = useLocationContext();

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
          <User className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-black text-white">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400">
            Access your orders, saved addresses, wishlist, and personalized recommendations.
          </p>
          <Button variant="primary" size="lg" className="w-full" onClick={toggleAuth}>
            Quick Demo Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Palamner VIP Member
            </div>
            <h1 className="text-2xl font-black text-white">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <Button variant="danger" size="md" onClick={logout}>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/orders" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition-all flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-white">2 Orders</div>
            <div className="text-xs text-slate-400">View History & Tracking</div>
          </div>
        </Link>

        <Link to="/wishlist" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-400/50 transition-all flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-white">Wishlist</div>
            <div className="text-xs text-slate-400">Saved Items</div>
          </div>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-white">{location.city}</div>
            <div className="text-xs text-slate-400">PIN: {location.pincode}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
