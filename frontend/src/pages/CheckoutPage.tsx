import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/order.service';
import type { Order } from '../types/order';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  PackageCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getSubtotal, getEstimatedTax, getDeliveryFee, getGrandTotal, clearCart } = useCartStore();

  const [step, setStep] = useState<'address' | 'delivery' | 'payment' | 'success'>('address');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Address State
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    streetAddress: 'Flat 402, Sunshine Meadows, 12th Main Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    instructions: '',
  });

  // Delivery Timing State
  const todayStr = new Date().toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('3:00 PM - 6:00 PM');

  const timeSlots = [
    { slot: '9:00 AM - 12:00 PM', label: 'Morning Slot', hint: 'Fresh Morning Bake' },
    { slot: '12:00 PM - 3:00 PM', label: 'Afternoon Slot', hint: 'Lunch Celebrations' },
    { slot: '3:00 PM - 6:00 PM', label: 'Evening Prime', hint: 'Standard Prime Slot' },
    { slot: '6:00 PM - 9:00 PM', label: 'Dinner Special', hint: 'Evening Party Hours' },
    { slot: 'Midnight (11:30 PM - 12:00 AM)', label: 'Midnight Surprise', hint: 'Birthday Eve Surprise' },
  ];

  const subtotal = getSubtotal();
  const tax = getEstimatedTax();
  const delivery = getDeliveryFee();
  const grandTotal = getGrandTotal();

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="py-20 text-center bg-cream-100 min-h-[80vh] flex flex-col items-center justify-center px-4">
        <Helmet>
          <title>Bag Empty | L'Étoile Pâtisserie</title>
        </Helmet>
        <div className="w-16 h-16 rounded-full bg-cream-200 text-chocolate-600 flex items-center justify-center mb-4">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 mb-2">
          Your Bakery Bag is Empty
        </h2>
        <p className="text-xs text-chocolate-600 mb-6 max-w-sm">
          Please add our freshly baked artisan cakes before proceeding to secure checkout.
        </p>
        <Link to="/cakes">
          <Button variant="primary" size="md">
            Explore Signature Cakes
          </Button>
        </Link>
      </div>
    );
  }

  const handleValidateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.streetAddress.trim()) {
      setErrorMessage('Please fill in all recipient and address details.');
      return;
    }
    setErrorMessage(null);
    setStep('delivery');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const orderPayload = {
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.streetAddress,
        delivery_city: formData.city,
        delivery_pincode: formData.pincode,
        delivery_date: deliveryDate,
        delivery_slot: selectedSlot,
        instructions: formData.instructions,
        payment_method: 'RAZORPAY_TEST',
        items: items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          image_url: item.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400',
          price: item.price,
          quantity: item.quantity,
          flavour: item.flavour || 'Belgian Chocolate',
          weight: item.weight || '1.0 KG',
          is_eggless: item.isEggless ?? true,
          custom_message: item.customMessage || undefined,
        })),
      };

      const result = await orderService.createOrder(orderPayload);
      setPlacedOrder(result);
      clearCart();
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-cream-100 min-h-screen">
      <Helmet>
        <title>Secure Checkout | L'Étoile Pâtisserie</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Bakery Checkout</span>
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-950 mt-1">
            Complete Your Celebration Order
          </h1>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 4: ORDER SUCCESS */}
        {step === 'success' ? (
          <div className="bg-cream-50 rounded-3xl p-8 sm:p-12 max-w-xl mx-auto text-center border border-cream-200/90 shadow-2xl space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Confirmed & Verified
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950 mt-2">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-chocolate-600 mt-1">
                Order <span className="font-mono font-bold text-chocolate-900">#{placedOrder?.order_number || 'LET-89234'}</span> • Receipt emailed to <span className="font-semibold">{formData.email}</span>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cream-100 text-xs text-chocolate-800 text-left space-y-2.5 border border-cream-200">
              <div className="flex items-center justify-between font-bold text-chocolate-950 border-b border-cream-200 pb-2">
                <span>Celebration Schedule:</span>
                <span className="text-gold-700">{deliveryDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-chocolate-600">Target Time Slot:</span>
                <span className="font-bold text-chocolate-900">{selectedSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-chocolate-600">Delivery Address:</span>
                <span className="font-semibold text-chocolate-900 text-right max-w-[60%] truncate">{formData.streetAddress}, {formData.city}</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold text-chocolate-950 border-t border-cream-200">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-800 font-extrabold">₹{placedOrder?.total_amount || grandTotal}</span>
              </div>
              <div className="pt-2 text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                <span>Status: Kitchen station dispatched order for sponge baking & frosting.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => navigate('/account')}
              >
                Track in My Account
              </Button>
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => navigate('/cakes')}
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Steps Container */}
            <div className="lg:col-span-7 bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft space-y-6">
              
              {/* Step indicator breadcrumbs */}
              <div className="flex items-center justify-between border-b border-cream-200 pb-4 text-xs font-bold">
                <div className={`flex items-center gap-1.5 ${step === 'address' ? 'text-chocolate-950 font-extrabold' : 'text-chocolate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'address' ? 'bg-chocolate-900 text-cream-50' : 'bg-cream-200 text-chocolate-600'}`}>1</span>
                  <span>Delivery Address</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-chocolate-300" />
                <div className={`flex items-center gap-1.5 ${step === 'delivery' ? 'text-chocolate-950 font-extrabold' : 'text-chocolate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'delivery' ? 'bg-chocolate-900 text-cream-50' : 'bg-cream-200 text-chocolate-600'}`}>2</span>
                  <span>Date & Slot</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-chocolate-300" />
                <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-chocolate-950 font-extrabold' : 'text-chocolate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-chocolate-900 text-cream-50' : 'bg-cream-200 text-chocolate-600'}`}>3</span>
                  <span>Razorpay Payment</span>
                </div>
              </div>

              {/* STEP 1: RECIPIENT & ADDRESS */}
              {step === 'address' && (
                <form onSubmit={handleValidateAddress} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-chocolate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-600" />
                      <span>Recipient & Delivery Address</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-chocolate-800 uppercase">Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-chocolate-800 uppercase">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase">Email for Invoice & Updates *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@letoile.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase">Street Address / Apartment / Landmark *</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat/House No., Building Name, Street"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-chocolate-800 uppercase">PIN Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="560038"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-chocolate-800 uppercase">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Bengaluru"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase">Delivery & Kitchen Instructions (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ring doorbell twice, keep cold bag upright"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-medium focus:outline-none focus:border-chocolate-700"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
                    Continue to Date & Time Slot
                  </Button>
                </form>
              )}

              {/* STEP 2: DATE & TIME SLOT SELECTION */}
              {step === 'delivery' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-chocolate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold-600" />
                      <span>Select Celebration Date & Time Slot</span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-chocolate-800 uppercase">Delivery Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-xs font-bold text-chocolate-900 focus:outline-none focus:border-chocolate-700"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-chocolate-800 uppercase">
                        Select Delivery Time Slot
                      </label>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Selected: {selectedSlot}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {timeSlots.map((ts) => {
                        const isSelected = selectedSlot === ts.slot;
                        return (
                          <button
                            key={ts.slot}
                            type="button"
                            onClick={() => setSelectedSlot(ts.slot)}
                            className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                              isSelected
                                ? 'bg-chocolate-900 text-cream-50 border-chocolate-900 ring-2 ring-gold-500 shadow-md scale-[1.01]'
                                : 'bg-cream-100 text-chocolate-800 border-cream-300 hover:border-chocolate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isSelected ? 'text-cream-50' : 'text-chocolate-900'}`}>
                                {ts.slot}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                              )}
                            </div>
                            <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-cream-200' : 'text-chocolate-500'}`}>
                              {ts.hint}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-cream-200">
                    <Button variant="outline" size="lg" onClick={() => setStep('address')}>
                      Back to Address
                    </Button>
                    <Button variant="primary" size="lg" className="flex-1" onClick={() => setStep('payment')}>
                      Proceed to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT GATEWAY */}
              {step === 'payment' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-serif text-lg font-bold text-chocolate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gold-600" />
                    <span>Payment Gateway</span>
                  </h3>

                  <div className="p-5 rounded-2xl border-2 border-gold-400 bg-cream-100/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-chocolate-900 text-gold-400 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-chocolate-950">Razorpay Secure Gateway</div>
                          <div className="text-[11px] text-chocolate-600">UPI (Google Pay, PhonePe, Paytm), Cards, Net Banking</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-cream-50 text-[11px] text-chocolate-700 border border-cream-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>256-bit Bank-Grade SSL Encryption • 100% On-Time Delivery Guarantee</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream-100 text-xs text-chocolate-800 space-y-1">
                    <div className="font-bold text-chocolate-900">Delivery Confirmation:</div>
                    <div>Recipient: <span className="font-semibold">{formData.fullName}</span> ({formData.phone})</div>
                    <div>Schedule: <span className="font-semibold">{deliveryDate}</span> ({selectedSlot})</div>
                    <div>Location: <span className="font-semibold">{formData.streetAddress}, {formData.city}</span></div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="lg" onClick={() => setStep('delivery')}>
                      Back
                    </Button>
                    <Button
                      variant="gold"
                      size="lg"
                      className="flex-1 font-bold text-chocolate-950 shadow-md"
                      isLoading={isSubmitting}
                      onClick={handlePlaceOrder}
                    >
                      Pay ₹{grandTotal} with Razorpay & Place Order
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-cream-50 rounded-3xl p-6 sm:p-8 border border-cream-200/90 shadow-soft h-fit space-y-5">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <h3 className="font-serif text-lg font-bold text-chocolate-950">
                  Order Summary
                </h3>
                <span className="text-xs font-bold text-chocolate-600 bg-cream-200 px-2.5 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'Cake' : 'Cakes'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-xs border-b border-cream-100 pb-2.5">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-cream-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-chocolate-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-chocolate-600">
                        {item.weight} • {item.flavour}
                        {item.isEggless && <span className="ml-1 text-emerald-700 font-bold">• Eggless</span>}
                      </div>
                      {item.customMessage && (
                        <div className="text-[10px] text-gold-800 italic truncate">
                          "{item.customMessage}"
                        </div>
                      )}
                      <div className="text-[11px] font-semibold text-chocolate-500 mt-0.5">
                        Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <div className="font-bold text-chocolate-950">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-cream-200 pt-3 space-y-2 text-xs text-chocolate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-chocolate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% Bakery Tax)</span>
                  <span className="font-semibold text-chocolate-900">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chilled Shockproof Delivery</span>
                  <span className="font-semibold text-chocolate-900">
                    {delivery === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-chocolate-950 pt-2.5 border-t border-cream-200">
                  <span>Total Amount</span>
                  <span className="text-chocolate-950">₹{grandTotal}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-100 text-[11px] text-chocolate-700 border border-cream-200 space-y-1">
                <div className="font-bold text-chocolate-900">🎉 Celebration Promise:</div>
                <div>Cakes are freshly baked on the morning of delivery with temperature-regulated packaging.</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
