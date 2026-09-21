import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getEstimatedTax,
    getDeliveryFee,
    getGrandTotal,
    getTotalCount,
  } = useCartStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const tax = getEstimatedTax();
  const delivery = getDeliveryFee();
  const grandTotal = getGrandTotal();
  const totalCount = getTotalCount();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCart(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 border-l border-cream-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-cream-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-chocolate-900 text-gold-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-xl font-bold text-chocolate-950">
                Your Bakery Bag ({totalCount})
              </h2>
            </div>
            <button
              onClick={() => toggleCart(false)}
              className="p-2 rounded-full text-chocolate-600 hover:bg-cream-200/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-chocolate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-chocolate-900">Your bag is empty</h3>
                  <p className="text-xs text-chocolate-600 max-w-xs">
                    Explore our artisanal cakes, bento treats, and cheesecakes to add sweetness to your celebration.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => toggleCart(false)}
                >
                  <Link to="/cakes">Browse Cakes</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-cream-100 rounded-2xl p-4 border border-cream-200/80 flex gap-3.5 relative"
                >
                  {/* Image */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-cream-200"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-chocolate-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-chocolate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-chocolate-600 mt-0.5 space-x-1.5">
                        <span>{item.flavour}</span>
                        <span>•</span>
                        <span>{item.weight}</span>
                        <span>•</span>
                        <span className={item.isEggless ? 'text-emerald-700 font-semibold' : ''}>
                          {item.isEggless ? 'Eggless' : 'Regular'}
                        </span>
                      </div>

                      {item.customMessage && (
                        <div className="text-[10px] text-gold-700 bg-gold-100/70 px-2 py-0.5 rounded mt-1.5 inline-block font-mono">
                          Message: "{item.customMessage}"
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-cream-200/60">
                      <div className="flex items-center gap-2 bg-cream-50 rounded-full border border-cream-300/80 px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-chocolate-700 hover:text-chocolate-950 p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-chocolate-900 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-chocolate-700 hover:text-chocolate-950 p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-chocolate-950">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-cream-200 bg-cream-50/90 space-y-3">
              <div className="space-y-1.5 text-xs text-chocolate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-chocolate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-chocolate-900">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-chocolate-900">
                    {delivery === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${delivery}`
                    )}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-[10px] text-chocolate-500 italic">
                    Add ₹{999 - subtotal} more for FREE Same-Day Delivery!
                  </p>
                )}
                <div className="flex justify-between text-sm font-bold text-chocolate-950 pt-2 border-t border-cream-200">
                  <span>Estimated Total</span>
                  <span className="text-base font-extrabold text-chocolate-950">₹{grandTotal}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/checkout" onClick={() => toggleCart(false)}>
                  <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-chocolate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe 256-bit encrypted checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
