import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password requirements check
  const isMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isMinLength || !hasUpper || !hasLower || !hasNumber) {
      setError('Please meet all password requirements.');
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({ name, email, password });
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-page">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-gray-950 font-black mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Create your account</h1>
          <p className="text-sm text-text-secondary mt-1">Join ShopSphere to watch, discover & shop</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rithesh Raja"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <User className="w-4 h-4 text-text-tertiary absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <Mail className="w-4 h-4 text-text-tertiary absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <Lock className="w-4 h-4 text-text-tertiary absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-text-tertiary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password checklist */}
            {password.length > 0 && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-surface-secondary/70 border border-border text-[11px] grid grid-cols-2 gap-1.5 text-text-secondary font-medium">
                <span className={`flex items-center gap-1 ${isMinLength ? 'text-emerald-500 font-bold' : ''}`}>
                  <Check className="w-3 h-3" /> 8+ characters
                </span>
                <span className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-500 font-bold' : ''}`}>
                  <Check className="w-3 h-3" /> Uppercase letter
                </span>
                <span className={`flex items-center gap-1 ${hasLower ? 'text-emerald-500 font-bold' : ''}`}>
                  <Check className="w-3 h-3" /> Lowercase letter
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-500 font-bold' : ''}`}>
                  <Check className="w-3 h-3" /> One number
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <Lock className="w-4 h-4 text-text-tertiary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-accent border-border rounded focus:ring-accent accent-accent cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-text-secondary cursor-pointer">
              I agree to the Terms of Service & Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-accent text-gray-950 font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-950" />
            ) : (
              <span>CREATE ACCOUNT</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
