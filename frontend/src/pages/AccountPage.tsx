import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Heart,
  LogOut,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/order.service';
import { Button } from '../components/ui/Button';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: () => orderService.getMyOrders(user?.email),
    enabled: isAuthenticated && !!user,
  });

  // If user is not logged in, show an authenticated gatekeeper
  if (!isAuthenticated || !user) {
    return (
      <div className="py-20 bg-cream-100 min-h-[85vh] flex items-center justify-center px-4">
        <Helmet>
          <title>My Account | L'Étoile Pâtisserie</title>
        </Helmet>
        <div className="bg-cream-50 rounded-3xl p-8 sm:p-10 border border-cream-200/90 shadow-2xl max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-chocolate-900 text-gold-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
              Customer Account
            </h1>
            <p className="text-xs text-chocolate-600 leading-relaxed">
              Sign in to view your celebration orders, live kitchen baking stages, past receipts, and account settings.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate('/login')}
            >
              <span>Sign In with Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => navigate('/register')}
            >
              Register New Customer Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
      case 'DECORATING':
        return 2;
      case 'READY_FOR_DISPATCH':
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="py-10 bg-cream-100 min-h-screen">
      <Helmet>
        <title>My Account & Orders | L'Étoile Pâtisserie</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-50 p-6 sm:p-8 rounded-3xl border border-cream-200/90 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-chocolate-900 text-gold-400 font-serif font-bold text-2xl flex items-center justify-center shadow">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-chocolate-950">
                  {user.full_name}
                </h1>
                {isAdmin && (
                  <span className="text-[10px] font-extrabold uppercase bg-gold-100 text-gold-800 px-2.5 py-0.5 rounded-full border border-gold-300">
                    Admin Staff
                  </span>
                )}
              </div>
              <p className="text-xs text-chocolate-600 mt-0.5">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Pâtisserie Account</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="gold" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="gap-1.5 text-rose-700 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Orders & Tracking */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-chocolate-950 flex items-center gap-2">
                <Package className="w-5 h-5 text-gold-600" />
                <span>Recent Celebration Orders ({orders.length})</span>
              </h2>
            </div>

            {isLoadingOrders ? (
              <div className="bg-cream-50 rounded-3xl p-10 text-center text-xs text-chocolate-600">
                Loading celebration orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-cream-50 rounded-3xl p-10 border border-cream-200 text-center space-y-4 shadow-soft">
                <div className="w-14 h-14 rounded-full bg-cream-200 text-chocolate-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-chocolate-900">
                    No orders placed yet
                  </h3>
                  <p className="text-xs text-chocolate-600 mt-1 max-w-sm mx-auto">
                    Explore our handcrafted Belgian truffles, Cheesecakes, and celebratory cakes.
                  </p>
                </div>
                <Link to="/cakes">
                  <Button variant="primary" size="md">
                    Explore Artisan Cakes
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const currentStep = getStatusStep(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-4"
                    >
                      {/* Order Head */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-3">
                        <div>
                          <span className="font-mono font-bold text-sm text-chocolate-950">
                            #{order.order_number}
                          </span>
                          <span className="text-xs text-chocolate-500 ml-2">
                            Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Today'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {order.status === 'CONFIRMED' && 'Order Confirmed'}
                            {order.status === 'PREPARING' && 'Baking Sponge in Oven'}
                            {order.status === 'DECORATING' && 'Frosting & Piping'}
                            {order.status === 'READY_FOR_DISPATCH' && 'Packed & Ready'}
                            {order.status === 'DELIVERED' && 'Delivered'}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-xs">
                            <img
                              src={item.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200'}
                              alt={item.product_name}
                              className="w-14 h-14 rounded-2xl object-cover bg-cream-200 shrink-0"
                            />
                            <div className="flex-1">
                              <div className="font-bold text-chocolate-900">{item.product_name}</div>
                              <div className="text-chocolate-600 text-[11px]">
                                {item.weight} • {item.flavour}
                                {item.is_eggless && <span className="ml-1 text-emerald-700 font-bold">• Eggless</span>}
                              </div>
                              {item.custom_message && (
                                <div className="text-[10px] text-gold-800 italic mt-0.5">
                                  Piped Message: "{item.custom_message}"
                                </div>
                              )}
                            </div>
                            <div className="text-right font-bold text-chocolate-950">
                              <div>₹{item.price * item.quantity}</div>
                              <div className="text-[10px] text-chocolate-500">Qty: {item.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery & Status Details */}
                      <div className="p-3.5 rounded-2xl bg-cream-100/90 text-xs text-chocolate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-chocolate-600">Celebration Schedule:</span>
                          <span className="font-bold text-chocolate-950">
                            {order.delivery_date} ({order.delivery_slot})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-chocolate-600">Delivery Address:</span>
                          <span className="font-medium text-chocolate-900 truncate max-w-[65%]">
                            {order.delivery_address}, {order.delivery_city}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-cream-200">
                          <span className="font-bold text-chocolate-900">Total Paid via Razorpay:</span>
                          <span className="font-extrabold text-chocolate-950 text-sm">₹{order.total_amount}</span>
                        </div>
                      </div>

                      {/* Visual 4-stage tracking bar */}
                      <div className="pt-2 border-t border-cream-200">
                        <div className="text-[10px] font-bold text-chocolate-500 uppercase tracking-wider mb-2">
                          Live Kitchen Baking Stages
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                          <div className={`p-2 rounded-xl border ${currentStep >= 1 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-cream-100 border-cream-200 text-chocolate-400'}`}>
                            ✓ Placed
                          </div>
                          <div className={`p-2 rounded-xl border ${currentStep >= 2 ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse' : 'bg-cream-100 border-cream-200 text-chocolate-400'}`}>
                            {currentStep >= 2 ? '● Baking/Decorating' : 'Baking'}
                          </div>
                          <div className={`p-2 rounded-xl border ${currentStep >= 3 ? 'bg-blue-100 border-blue-300 text-blue-900' : 'bg-cream-100 border-cream-200 text-chocolate-400'}`}>
                            {currentStep >= 3 ? '✓ Dispatch' : 'Dispatch'}
                          </div>
                          <div className={`p-2 rounded-xl border ${currentStep >= 4 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-cream-100 border-cream-200 text-chocolate-400'}`}>
                            {currentStep >= 4 ? '✓ Delivered' : 'Delivered'}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions & Preferences Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-4">
              <h3 className="font-serif text-lg font-bold text-chocolate-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>Quick Actions</span>
              </h3>

              <div className="space-y-2 text-xs font-semibold">
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-chocolate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Saved Wishlist</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-chocolate-400" />
                </Link>

                <Link
                  to="/cakes"
                  className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-chocolate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-gold-600" />
                    <span>Order Another Cake</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-chocolate-400" />
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between p-3 rounded-2xl bg-chocolate-900 text-gold-400 hover:bg-chocolate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 font-bold">
                      <UserIcon className="w-4 h-4" />
                      <span>Admin Operations Portal</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Delivery Guarantee Card */}
            <div className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-2 text-xs text-chocolate-700">
              <div className="font-bold text-chocolate-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Patisserie Freshness Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed text-chocolate-600">
                All celebration cakes are baked on the day of delivery with real French butter and Belgian chocolate. Chilled insulated packaging ensures perfect temperature upon arrival.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
