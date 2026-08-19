import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { User, MapPin, Package, Heart, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Link } from 'react-router-dom';

export const AccountPage = () => {
  const { user, isLoggedIn, logout, toggleAuth } = useAuth();
  const { location } = useLocationContext();

  if (!isLoggedIn) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
          <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xl space-y-4">
            <User className="w-12 h-12 text-[#E50914] mx-auto" />
            <h2 className="text-2xl font-black text-black">Sign In to Your Account</h2>
            <p className="text-xs text-neutral-500">
              Access your orders, saved addresses, wishlist, and AI personalized recommendations.
            </p>
            <Button variant="primary" size="lg" className="w-full" onClick={toggleAuth}>
              Quick Demo Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Header */}
        <div className="bg-black text-white border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E50914] shadow-xl"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-[#E50914] text-[10px] font-black uppercase tracking-wider">
                Palamner VIP Member
              </div>
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <p className="text-xs text-neutral-400">{user.email}</p>
            </div>
          </div>

          <Button variant="danger" size="md" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link to="/orders" className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 hover:border-[#E50914] transition-all flex items-center gap-4">
            <div className="p-3 bg-red-50 text-[#E50914] rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-black">2 Orders</div>
              <div className="text-xs text-neutral-500">View History & Tracking</div>
            </div>
          </Link>

          <Link to="/wishlist" className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 hover:border-[#E50914] transition-all flex items-center gap-4">
            <div className="p-3 bg-red-50 text-[#E50914] rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-black">Wishlist</div>
              <div className="text-xs text-neutral-500">Saved Items</div>
            </div>
          </Link>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-neutral-200 text-black rounded-xl">
              <MapPin className="w-6 h-6 text-[#E50914]" />
            </div>
            <div>
              <div className="text-lg font-black text-black">{location.city}</div>
              <div className="text-xs text-neutral-500">PIN: {location.pincode}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
