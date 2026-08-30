import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, Shield, LogOut, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AddressesPage from './AddressesPage.jsx';
import SecurityPage from './SecurityPage.jsx';

export const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, logout, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || user?.avatar || '');
  const [pincode, setPincode] = useState(user?.pincode || '517408');
  const [city, setCity] = useState(user?.city || 'Palamner, Andhra Pradesh');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateProfile({
        name: name.trim(),
        avatarUrl: avatarUrl.trim(),
        pincode: pincode.trim(),
        city: city.trim(),
      });
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-accent text-gray-950 font-black text-2xl flex items-center justify-center overflow-hidden shadow-inner">
              {user?.avatar || user?.avatarUrl ? (
                <img
                  src={user?.avatarUrl || user?.avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-[10px] uppercase">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>SIGN OUT</span>
        </button>
      </div>

      {/* Main Account Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1 bg-surface border border-border p-2 rounded-2xl h-fit">
          <button
            onClick={() => handleTabChange('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors text-left ${
              activeTab === 'profile'
                ? 'bg-accent text-gray-950 shadow-sm'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => handleTabChange('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors text-left ${
              activeTab === 'addresses'
                ? 'bg-accent text-gray-950 shadow-sm'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Addresses</span>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors text-left"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => navigate('/wishlist')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors text-left"
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
          </button>

          <button
            onClick={() => handleTabChange('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors text-left ${
              activeTab === 'security'
                ? 'bg-accent text-gray-950 shadow-sm'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-text-primary tracking-tight mb-4 pb-3 border-b border-border">
                Account Information
              </h2>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg text-xs">
                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full p-2.5 bg-surface-secondary/50 border border-border rounded-xl text-sm text-text-tertiary cursor-not-allowed"
                  />
                  <p className="text-[11px] text-text-tertiary mt-1 italic">
                    Email verification is required to change your registered email address.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-text-secondary uppercase mb-1">Profile Avatar URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text-secondary uppercase mb-1">City / Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-text-secondary uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-accent text-gray-950 font-bold rounded-xl hover:opacity-90 transition-opacity mt-2"
                >
                  {loading ? 'Saving...' : 'Edit Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && <AddressesPage />}

          {activeTab === 'security' && <SecurityPage />}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
