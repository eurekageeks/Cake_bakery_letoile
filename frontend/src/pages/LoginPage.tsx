import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Cake, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { GoogleLogin } from '@react-oauth/google';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      await login({ email, password });
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Invalid email or password.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLocalError(null);
    clearError();
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      } catch (err: any) {
        setLocalError(err.message || 'Google Sign-In failed.');
      }
    }
  };

  return (
    <div className="py-14 bg-cream-100 min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Sign In | L'Étoile Pâtisserie</title>
      </Helmet>

      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-chocolate-900 text-gold-400 flex items-center justify-center shadow-md">
              <Cake className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-chocolate-950">
            Welcome Back
          </h1>
          <p className="text-xs text-chocolate-600">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Main Credentials Form */}
        <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft">
          {(localError || error) && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-chocolate-900 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@domain.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Password</label>
                <a href="#" className="text-[11px] font-semibold text-gold-700 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-chocolate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In to Bakery
            </Button>
          </form>

          <div className="mt-6 flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-cream-50 px-2 text-chocolate-500">Or continue with</span>
              </div>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setLocalError('Google Sign-In failed.');
                }}
              />
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-chocolate-600 pt-4 border-t border-cream-200">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-chocolate-950 underline hover:text-gold-700">
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
