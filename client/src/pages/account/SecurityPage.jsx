import React, { useState } from 'react';
import { Shield, Lock, Key, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';

export const SecurityPage = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      setMessage(res?.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-extrabold text-text-primary tracking-tight flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <span>Security & Authentication</span>
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Manage your password and security credentials
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Password Change Form */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-accent" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-text-secondary uppercase mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text-secondary uppercase mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text-secondary uppercase mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-accent text-gray-950 font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication Placeholder */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-accent" />
            <span>Two-Factor Authentication (2FA)</span>
          </h3>
          <p className="text-xs text-text-secondary">
            Add an extra layer of security to your ShopSphere account.
          </p>
        </div>
        <span className="px-3 py-1 bg-surface-secondary text-text-tertiary text-xs font-bold rounded-full border border-border">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default SecurityPage;
