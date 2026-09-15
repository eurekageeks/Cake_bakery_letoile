import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Cake, AlertCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [pendingApprovalSuccess, setPendingApprovalSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register({ full_name: fullName, email, phone, password });
      setPendingApprovalSuccess(true);
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="py-14 bg-cream-100 min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Create Account | L'Étoile Pâtisserie</title>
      </Helmet>

      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-chocolate-900 text-gold-400 flex items-center justify-center shadow-md">
              <Cake className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-chocolate-950">
            Create Your Account
          </h1>
          <p className="text-xs text-chocolate-600">
            Join the Pâtisserie Club for bespoke celebrations and order tracking.
          </p>
        </div>

        {/* Pending Approval Success Card */}
        {pendingApprovalSuccess ? (
          <div className="bg-cream-50 rounded-3xl p-8 border border-gold-300 shadow-card text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-chocolate-950">
                Registration Request Submitted!
              </h2>
              <p className="text-xs text-chocolate-700 leading-relaxed max-w-xs mx-auto">
                Thank you for joining <strong>L'Étoile Pâtisserie</strong>. For bakery quality and order verification, all new customer accounts are reviewed by our bakery administrator.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 text-left text-xs space-y-1.5 text-chocolate-800">
              <div className="flex items-center gap-2 text-gold-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Next Steps</span>
              </div>
              <p className="text-[11px] text-chocolate-600">
                1. The admin will verify your account request: <span className="font-bold text-chocolate-900">{email}</span>.
              </p>
              <p className="text-[11px] text-chocolate-600">
                2. Once approved by the administrator, you can log in directly using your email and password.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate('/login')}
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          /* Main Form */
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft">
            {(localError || error) && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{localError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Verma"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@example.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cream-100 border border-cream-300 text-[11px] text-chocolate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Account activation requires one-time admin approval.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Submit Registration for Approval
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-chocolate-600 pt-4 border-t border-cream-200">
              Already approved or have an account?{' '}
              <Link to="/login" className="font-bold text-chocolate-950 underline hover:text-gold-700">
                Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
