import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
  ChefHat,
  Plus,
  Edit2,
  Layers,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { adminService } from '../services/admin.service';
import { productService } from '../services/product.service';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { sampleBestSellers } from '../components/home/BestSellersSection';
import type { Product } from '../types/product';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'approvals' | 'customers'>('analytics');
  
  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    base_price: '' as string | number,
    discount_price: '' as string | number,
    category_name: 'Chocolate Cakes',
    occasion: 'Birthday',
    preparation_time_hours: 3 as string | number,
    eggless_available: true,
    best_seller: false,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
  });

  // Queries
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminService.getAnalytics,
    enabled: isAuthenticated && isAdmin,
    initialData: {
      today_revenue: 48920,
      today_revenue_formatted: '₹48,920',
      today_orders_count: 42,
      pending_delivery_count: 6,
      total_customers_count: 1840,
      active_baking_count: 6,
      recent_orders: [
        { id: '1', order_number: 'LET-89234', customer_name: 'Aarav Sharma', items_summary: 'Belgian Truffle (1 KG)', delivery_date: 'Today', delivery_slot: '3 PM - 6 PM', total_amount: 944, status: 'PREPARING', is_urgent: true },
        { id: '2', order_number: 'LET-89233', customer_name: 'Rhea Sen', items_summary: 'Blueberry Basque Cheesecake (1.5 KG)', delivery_date: 'Today', delivery_slot: '1:30 PM', total_amount: 1593, status: 'DECORATING', is_urgent: false },
        { id: '3', order_number: 'LET-89232', customer_name: 'Deepak Kapoor', items_summary: 'Lotus Biscoff Dream (0.5 KG)', delivery_date: 'Today', delivery_slot: '12:00 PM', total_amount: 699, status: 'DELIVERED', is_urgent: false },
      ],
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getProducts({ limit: 50 }),
    enabled: isAuthenticated && isAdmin,
  });

  const { data: pendingCustomers = [] } = useQuery({
    queryKey: ['admin-pending-customers'],
    queryFn: adminService.getPendingCustomers,
    enabled: isAuthenticated && isAdmin,
  });

  const { data: customersData } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: adminService.getCustomers,
    enabled: isAuthenticated && isAdmin,
    initialData: [
      { id: '1', full_name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', role: 'CUSTOMER (Approved)', orders_count: 4, total_spent: 3840, created_at: 'Aug 12, 2026' },
      { id: '2', full_name: 'Rhea Sen', email: 'rhea.sen@gmail.com', phone: '+91 98111 22334', role: 'CUSTOMER (Approved)', orders_count: 2, total_spent: 2490, created_at: 'Sep 02, 2026' },
      { id: '3', full_name: 'Vikram Malhotra', email: 'vikram.m@outlook.com', phone: '+91 99887 76655', role: 'CUSTOMER (Approved)', orders_count: 5, total_spent: 6120, created_at: 'Jul 24, 2026' },
    ],
  });

  const products = productsData?.data && productsData.data.length > 0 ? productsData.data : sampleBestSellers;

  // Order status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      adminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
  });

  // Customer approval mutations
  const approveCustomerMutation = useMutation({
    mutationFn: (userId: string) => adminService.approveCustomer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });

  const rejectCustomerMutation = useMutation({
    mutationFn: (userId: string) => adminService.rejectCustomer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });

  // Product Create/Update mutation
  const saveProductMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      const payload = {
        ...data,
        base_price: Number(data.base_price) || 0,
        discount_price: data.discount_price !== '' && data.discount_price !== undefined ? Number(data.discount_price) : undefined,
        preparation_time_hours: Number(data.preparation_time_hours) || 3,
      };
      if (editingProduct) {
        return adminService.updateProduct(editingProduct.id, payload as any);
      }
      return adminService.createProduct(payload as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsModalOpen(false);
      setEditingProduct(null);
    },
  });

  // Access Protection Guard
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="py-20 bg-cream-100 min-h-[85vh] flex items-center justify-center px-4">
        <Helmet>
          <title>Admin Login Required | L'Étoile Pâtisserie</title>
        </Helmet>
        <div className="bg-cream-50 rounded-3xl p-8 sm:p-10 border border-cream-200/90 shadow-2xl max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-chocolate-900 text-gold-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
              Staff Portal Protected
            </h1>
            <p className="text-xs text-chocolate-600 leading-relaxed">
              Administrative credentials required to access bakery operations, product inventory, and customer approvals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 text-left text-xs space-y-1 text-chocolate-800">
            <div className="font-bold text-gold-700">Admin Sign-In Credentials:</div>
            <div>Username: <span className="font-mono font-bold">admin@letoile.com</span></div>
            <div>Password: <span className="font-mono font-bold">admin123</span></div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2"
              onClick={() => navigate('/login')}
            >
              <span>Sign In as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      short_description: '',
      description: '',
      base_price: '',
      discount_price: '',
      category_name: 'Chocolate Cakes',
      occasion: 'Birthday',
      preparation_time_hours: 3,
      eggless_available: true,
      best_seller: false,
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      short_description: p.short_description,
      description: p.description,
      base_price: p.base_price,
      discount_price: p.discount_price !== undefined ? p.discount_price : '',
      category_name: p.category,
      occasion: p.occasion || 'Birthday',
      preparation_time_hours: p.preparation_time_hours || 3,
      eggless_available: p.eggless_available,
      best_seller: p.best_seller,
      image_url: p.image_url,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="py-8 bg-cream-100 min-h-screen">
      <Helmet>
        <title>Bakery Staff & Kitchen Operations | L'Étoile</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Operational Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-50 p-6 rounded-3xl border border-cream-200/90 shadow-soft">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-chocolate-900 text-gold-400 flex items-center justify-center font-bold shadow">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-chocolate-950">
                  Bakery Operations Portal
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-gold-100 text-gold-700 px-2.5 py-0.5 rounded-full border border-gold-300">
                  Verified Admin Session
                </span>
              </div>
              <p className="text-xs text-chocolate-600">
                Logged in as <span className="font-bold text-chocolate-900">{user?.full_name || 'Master Pastry Chef'}</span> ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAddModal}
              className="gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Cake</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-cream-300 pb-2 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics & KPIs', icon: TrendingUp },
            { id: 'products', label: `Cake Catalog (${products.length})`, icon: Layers },
            { id: 'orders', label: 'Kitchen & Dispatch Queue', icon: Clock },
            { id: 'approvals', label: `Pending Approvals (${pendingCustomers.length})`, icon: UserCheck, badge: pendingCustomers.length > 0 },
            { id: 'customers', label: 'Customer Directory', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                    : 'bg-cream-50 text-chocolate-700 hover:bg-cream-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate-600">Today's Revenue</span>
                  <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-chocolate-950">{analytics.today_revenue_formatted}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">+18.4% vs yesterday</div>
              </div>

              <div className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate-600">Today's Orders</span>
                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-chocolate-950">{analytics.today_orders_count} Orders</div>
                <div className="text-[11px] text-amber-800 font-semibold">{analytics.pending_delivery_count} pending kitchen dispatch</div>
              </div>

              <div className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate-600">Pending Customer Requests</span>
                  <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-800">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-chocolate-950">{pendingCustomers.length} Awaiting</div>
                <div className="text-[11px] text-rose-700 font-semibold">Review and approve accounts</div>
              </div>

              <div className="bg-cream-50 rounded-3xl p-6 border border-cream-200/90 shadow-soft space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-chocolate-600">Active Kitchen Stations</span>
                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                    <ChefHat className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-chocolate-950">{analytics.active_baking_count} In Progress</div>
                <div className="text-[11px] text-emerald-700 font-semibold">100% on delivery schedule</div>
              </div>
            </div>

            {/* Live Queue Overview */}
            <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-chocolate-950 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-600" />
                  <span>Real-Time Kitchen Dispatch Monitor</span>
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Live Orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-chocolate-800">
                  <thead className="bg-cream-100 text-chocolate-900 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Order #</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items & Flavour</th>
                      <th className="p-3.5">Slot</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5 rounded-r-xl">Kitchen State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {analytics.recent_orders.map((o) => (
                      <tr key={o.id} className="hover:bg-cream-100/50">
                        <td className="p-3.5 font-mono font-bold text-chocolate-900">{o.order_number}</td>
                        <td className="p-3.5 font-semibold">{o.customer_name}</td>
                        <td className="p-3.5">{o.items_summary}</td>
                        <td className="p-3.5 font-bold text-amber-900">{o.delivery_slot}</td>
                        <td className="p-3.5 font-bold">₹{o.total_amount}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-chocolate-950">
                  Artisan Cake Catalog Management
                </h2>
                <p className="text-xs text-chocolate-600">
                  Create new cakes, set pricing, and manage dietary variants.
                </p>
              </div>

              <Button variant="primary" size="sm" onClick={handleOpenAddModal} className="gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Add Cake</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-chocolate-800">
                <thead className="bg-cream-100 text-chocolate-900 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Cake Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Base Price</th>
                    <th className="p-3.5">Discount Price</th>
                    <th className="p-3.5">Eggless</th>
                    <th className="p-3.5">Badges</th>
                    <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-cream-100/50">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-cream-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-chocolate-900 line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-chocolate-500">Prep: ~{p.preparation_time_hours || 3} Hours</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-chocolate-700">{p.category}</td>
                      <td className="p-3.5 font-bold text-chocolate-950">₹{p.base_price}</td>
                      <td className="p-3.5 text-rose-700 font-semibold">
                        {p.discount_price ? `₹${p.discount_price}` : '—'}
                      </td>
                      <td className="p-3.5">
                        {p.eggless_available ? (
                          <span className="text-emerald-700 font-bold">✓ Yes</span>
                        ) : (
                          <span className="text-chocolate-400">Regular</span>
                        )}
                      </td>
                      <td className="p-3.5 space-x-1">
                        {p.best_seller && <Badge variant="bestseller" size="sm">Best Seller</Badge>}
                        {p.featured && <Badge variant="gold" size="sm">Featured</Badge>}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-cream-200 hover:bg-cream-300 text-chocolate-800 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KITCHEN ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft space-y-4">
            <h2 className="font-serif text-xl font-bold text-chocolate-950 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-gold-600" />
              <span>Live Kitchen Bakery Orders Pipeline</span>
            </h2>
            <p className="text-xs text-chocolate-600">
              Advance cake orders across stations: Baking → Decorating → Dispatch → Delivered.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {[
                {
                  id: 'ord-1',
                  number: 'LET-89234',
                  customer: 'Aarav Sharma',
                  phone: '+91 98765 43210',
                  address: 'Flat 402, Sunshine Meadows, Indiranagar',
                  items: 'Belgian Dark Chocolate Ganache Truffle (1.0 KG)',
                  eggless: true,
                  message: 'Happy Birthday Rhea!',
                  slot: 'Today, 3:00 PM - 6:00 PM',
                  status: 'PREPARING',
                  amount: 944,
                },
                {
                  id: 'ord-2',
                  number: 'LET-89233',
                  customer: 'Rhea Sen',
                  phone: '+91 98111 22334',
                  address: 'Villa 12, Palm Meadows, Whitefield',
                  items: 'Wild Blueberry Basque Cheesecake (1.5 KG)',
                  eggless: true,
                  message: 'Congratulations on your Promotion!',
                  slot: 'Today, 1:30 PM',
                  status: 'DECORATING',
                  amount: 1593,
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="bg-cream-100 rounded-3xl p-6 border border-cream-300/80 shadow-soft space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-cream-300 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-chocolate-950">#{order.number}</span>
                      <div className="text-xs text-chocolate-600 font-medium">{order.customer} • {order.phone}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-chocolate-800">
                    <div className="font-bold text-chocolate-950">{order.items}</div>
                    {order.eggless && (
                      <div className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>100% Eggless Preparation Station</span>
                      </div>
                    )}
                    {order.message && (
                      <div className="p-2 rounded-xl bg-gold-100/70 border border-gold-300 text-gold-900 font-mono text-[11px]">
                        Piped Message: "{order.message}"
                      </div>
                    )}
                    <div className="text-chocolate-600 text-[11px] pt-1">
                      📍 {order.address}
                    </div>
                    <div className="text-chocolate-900 font-semibold text-[11px]">
                      🕒 Target Delivery Slot: {order.slot}
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="pt-3 border-t border-cream-300 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-chocolate-500">Advance Stage:</span>
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'PREPARING' })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cream-200 hover:bg-cream-300 text-chocolate-900"
                    >
                      Baking
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'DECORATING' })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-200 hover:bg-amber-300 text-amber-950"
                    >
                      Decorating
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'READY_FOR_DISPATCH' })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-200 hover:bg-blue-300 text-blue-950"
                    >
                      Ready for Dispatch
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'DELIVERED' })}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-200 hover:bg-emerald-300 text-emerald-950"
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PENDING APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-chocolate-950 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-gold-600" />
                  <span>Customer Registration Requests ({pendingCustomers.length})</span>
                </h2>
                <p className="text-xs text-chocolate-600">
                  New customer accounts awaiting verification before they can sign in and place orders.
                </p>
              </div>
            </div>

            {pendingCustomers.length === 0 ? (
              <div className="p-10 text-center space-y-3 bg-cream-100 rounded-2xl border border-cream-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-base font-bold text-chocolate-900">
                  All customer registrations are up to date!
                </h3>
                <p className="text-xs text-chocolate-600">
                  No pending customer account approvals in the queue.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-chocolate-800">
                  <thead className="bg-cream-100 text-chocolate-900 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Customer Name</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Requested On</th>
                      <th className="p-3.5 rounded-r-xl text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {pendingCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-cream-100/50">
                        <td className="p-3.5 font-bold text-chocolate-950">{c.full_name}</td>
                        <td className="p-3.5 text-chocolate-700 font-mono">{c.email}</td>
                        <td className="p-3.5">{c.phone || '—'}</td>
                        <td className="p-3.5 text-chocolate-500">{c.created_at}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => approveCustomerMutation.mutate(c.id)}
                            disabled={approveCustomerMutation.isPending}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                          >
                            ✓ Approve Customer
                          </button>
                          <button
                            onClick={() => rejectCustomerMutation.mutate(c.id)}
                            disabled={rejectCustomerMutation.isPending}
                            className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft space-y-6">
            <h2 className="font-serif text-xl font-bold text-chocolate-950">
              Registered Customer Directory
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-chocolate-800">
                <thead className="bg-cream-100 text-chocolate-900 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Customer</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Role / Status</th>
                    <th className="p-3.5">Total Orders</th>
                    <th className="p-3.5">Total Spent</th>
                    <th className="p-3.5 rounded-r-xl">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {customersData.map((c) => (
                    <tr key={c.id} className="hover:bg-cream-100/50">
                      <td className="p-3.5 font-bold text-chocolate-950">{c.full_name}</td>
                      <td className="p-3.5 text-chocolate-600">{c.email}</td>
                      <td className="p-3.5">{c.phone || '—'}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-200 text-chocolate-800">
                          {c.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">{c.orders_count} Orders</td>
                      <td className="p-3.5 font-bold text-chocolate-950">₹{c.total_spent}</td>
                      <td className="p-3.5 text-chocolate-500">{c.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* CREATE / EDIT PRODUCT MODAL (WITH EASY PRICING) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-cream-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-serif text-xl font-bold text-chocolate-950">
                {editingProduct ? 'Edit Cake Product' : 'Add New Artisan Cake'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-chocolate-500 hover:bg-cream-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProductMutation.mutate(formData);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-chocolate-900 uppercase">Cake Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Belgian Dark Chocolate Ganache Truffle"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-chocolate-900 focus:outline-none focus:border-chocolate-700 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-chocolate-900 uppercase">Category</label>
                  <select
                    value={formData.category_name}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-300 font-semibold"
                  >
                    <option>Chocolate Cakes</option>
                    <option>Birthday Cakes</option>
                    <option>Bento Cakes</option>
                    <option>Cheesecakes</option>
                    <option>Designer Cakes</option>
                    <option>Sugar-Free Cakes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-chocolate-900 uppercase">Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-300 font-semibold"
                  >
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Wedding</option>
                    <option>Party</option>
                    <option>Festivals</option>
                  </select>
                </div>
              </div>

              {/* EASY PRICING CONTROLS */}
              <div className="p-4 rounded-2xl bg-cream-100/80 border border-cream-300 space-y-2.5">
                <div className="font-bold text-xs uppercase tracking-wide text-chocolate-900">
                  Cake Pricing & Preparation
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-chocolate-700 text-[11px]">Original Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      step={10}
                      placeholder="e.g. 899"
                      value={formData.base_price}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(?=\d)/, '');
                        setFormData({ ...formData, base_price: val });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 font-bold text-chocolate-950 text-sm focus:outline-none focus:border-chocolate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-chocolate-700 text-[11px]">Discounted Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      placeholder="e.g. 799"
                      value={formData.discount_price}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(?=\d)/, '');
                        setFormData({ ...formData, discount_price: val });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 font-bold text-rose-700 text-sm focus:outline-none focus:border-chocolate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-chocolate-700 text-[11px]">Prep Time (Hours)</label>
                    <input
                      type="number"
                      min={1}
                      max={48}
                      placeholder="3"
                      value={formData.preparation_time_hours}
                      onChange={(e) => {
                        const val = e.target.value.replace(/^0+(?=\d)/, '');
                        setFormData({ ...formData, preparation_time_hours: val });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 font-semibold text-sm focus:outline-none focus:border-chocolate-700"
                    />
                  </div>
                </div>
                {Number(formData.discount_price) > 0 &&
                  Number(formData.base_price) > Number(formData.discount_price) && (
                  <div className="text-[11px] text-emerald-700 font-bold">
                    ✓ Customer Savings: ₹{Number(formData.base_price) - Number(formData.discount_price)} ({Math.round(((Number(formData.base_price) - Number(formData.discount_price)) / Number(formData.base_price)) * 100)}% OFF)
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-chocolate-900 uppercase">Short Highlight</label>
                <input
                  type="text"
                  required
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="One sentence description of chocolate origin and sponge texture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-chocolate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-chocolate-900 uppercase">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-chocolate-900"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.eggless_available}
                    onChange={(e) => setFormData({ ...formData, eggless_available: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <span>100% Eggless Option</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formData.best_seller}
                    onChange={(e) => setFormData({ ...formData, best_seller: e.target.checked })}
                    className="w-4 h-4 text-gold-600 rounded cursor-pointer"
                  />
                  <span>Mark Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <Button type="button" variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={saveProductMutation.isPending}>
                  {editingProduct ? 'Save Changes' : 'Publish Cake to Catalog'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
