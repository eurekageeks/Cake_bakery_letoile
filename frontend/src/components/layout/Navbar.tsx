import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Cake, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const cartCount = useCartStore((state) => state.getTotalCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cakes', path: '/cakes' },
    { name: 'Occasions', path: '/occasions' },
    { name: 'Custom Cakes', path: '/custom-cakes' },
    { name: 'Bento & Petite', path: '/bento-cakes' },
    { name: 'About Our Bakery', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header border-b border-cream-200/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-chocolate-800 hover:bg-cream-200/60 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-chocolate-900 text-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Cake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-chocolate-900 leading-none">
                L'Étoile
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-gold-600 mt-0.5">
                Artisan Pâtisserie
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-chocolate-950 font-semibold'
                      : 'text-chocolate-700/80 hover:text-chocolate-950'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Button */}
            <Link
              to="/cakes"
              className="p-2.5 rounded-full text-chocolate-800 hover:bg-cream-200/80 transition-colors"
              title="Search Cakes"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="p-2.5 rounded-full text-chocolate-800 hover:bg-cream-200/80 transition-colors relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blush-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-cream-200 hover:bg-cream-300 text-chocolate-900 text-xs font-bold transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-chocolate-900 text-gold-400 flex items-center justify-center text-xs font-serif">
                    {user.full_name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.full_name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-chocolate-600" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-cream-50 rounded-2xl border border-cream-300 shadow-xl py-2 z-50 animate-fade-in"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-cream-200">
                      <div className="font-bold text-xs text-chocolate-950 truncate">{user.full_name}</div>
                      <div className="text-[10px] text-chocolate-500 truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/account"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-chocolate-800 hover:bg-cream-200 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile & Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gold-800 bg-gold-50/60 hover:bg-gold-100 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-gold-600" />
                        <span>Staff Admin Portal</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left border-t border-cream-200 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 py-2 px-4 rounded-full bg-cream-200 hover:bg-cream-300 text-chocolate-900 text-xs font-bold transition-all"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => toggleCart(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-chocolate-900 text-cream-50 hover:bg-chocolate-800 transition-all shadow-sm active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-semibold">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50 px-6 py-6 space-y-4 animate-fade-in shadow-xl">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-base font-medium text-chocolate-900 hover:bg-cream-200 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
            {isAuthenticated ? (
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-chocolate-800"
              >
                <User className="w-4 h-4" />
                <span>My Profile ({user?.full_name.split(' ')[0]})</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold text-chocolate-900 bg-cream-200 px-4 py-2 rounded-full"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
            )}

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
