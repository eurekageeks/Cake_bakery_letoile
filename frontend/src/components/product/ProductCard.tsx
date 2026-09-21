import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus, Sparkles } from 'lucide-react';
import type { Product } from '../../types/product';
import { Badge } from '../ui/Badge';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image_url: product.image_url,
      price: product.discount_price || product.base_price,
      quantity: 1,
      flavour: 'Belgian Chocolate',
      weight: '0.5 KG',
      isEggless: product.eggless_available,
      preparationHours: product.preparation_time_hours || 3,
    });
    toggleCart(true);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercent =
    product.discount_price && product.base_price > product.discount_price
      ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
      : null;

  return (
    <div className="group relative bg-cream-50 rounded-3xl border border-cream-200/90 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.best_seller && (
          <Badge variant="bestseller" size="sm">
            Best Seller
          </Badge>
        )}
        {discountPercent && (
          <Badge variant="discount" size="sm">
            {discountPercent}% OFF
          </Badge>
        )}
        {product.eggless_available && (
          <Badge variant="eggless" size="sm">
            100% Eggless
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          isWishlisted
            ? 'bg-blush-500 text-white shadow-md'
            : 'bg-cream-50/90 text-chocolate-700 hover:bg-cream-100 hover:text-blush-500'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
      </button>

      {/* Image Container with Zoom */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-cream-200/50">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.customizable && (
          <div className="absolute bottom-2 left-2 bg-chocolate-900/80 backdrop-blur-sm text-gold-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Custom Message Available</span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-chocolate-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-1 text-chocolate-900">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-chocolate-400">({product.review_count})</span>
            <span className="text-chocolate-300">•</span>
            <span className="text-[11px] text-chocolate-500">{product.category}</span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-900 line-clamp-1 group-hover:text-chocolate-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-chocolate-600/90 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>

        {/* Pricing & Quick Add */}
        <div className="pt-2 border-t border-cream-200/70 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-chocolate-400 font-medium">Starts from</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-chocolate-950">
                ₹{product.discount_price || product.base_price}
              </span>
              {product.discount_price && (
                <span className="text-xs text-chocolate-400 line-through">
                  ₹{product.base_price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cream-200 hover:bg-chocolate-900 hover:text-cream-50 text-chocolate-900 text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95"
            title="Quick Add to Cart"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
