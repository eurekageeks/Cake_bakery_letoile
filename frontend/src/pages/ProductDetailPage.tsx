import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { sampleBestSellers } from '../components/home/BestSellersSection';
import type { CakeFlavour, CakeWeight } from '../types/product';
import { Star, Clock, Heart, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = sampleBestSellers.find((p) => p.slug === slug) || sampleBestSellers[0];

  const [selectedFlavour, setSelectedFlavour] = useState<CakeFlavour>('Belgian Chocolate');
  const [selectedWeight, setSelectedWeight] = useState<CakeWeight>('1.0 KG');
  const [isEggless, setIsEggless] = useState<boolean>(true);
  const [cakeMessage, setCakeMessage] = useState<string>('');

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const flavours: CakeFlavour[] = [
    'Belgian Chocolate',
    'Red Velvet',
    'Classic Black Forest',
    'Lotus Biscoff',
    'Vanilla Bean',
  ];

  const weights: { label: CakeWeight; priceMultiplier: number }[] = [
    { label: '0.5 KG', priceMultiplier: 0.7 },
    { label: '1.0 KG', priceMultiplier: 1.0 },
    { label: '1.5 KG', priceMultiplier: 1.45 },
    { label: '2.0 KG', priceMultiplier: 1.9 },
  ];

  const currentMultiplier = weights.find((w) => w.label === selectedWeight)?.priceMultiplier || 1.0;
  const currentPrice = Math.round((product.discount_price || product.base_price) * currentMultiplier);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image_url: product.image_url,
      price: currentPrice,
      quantity: 1,
      flavour: selectedFlavour,
      weight: selectedWeight,
      isEggless: isEggless,
      customMessage: cakeMessage,
      preparationHours: product.preparation_time_hours || 3,
    });
    toggleCart(true);
  };

  return (
    <div className="py-10 bg-cream-100 min-h-screen">
      <Helmet>
        <title>{product.name} | L'Étoile Pâtisserie</title>
        <meta name="description" content={product.short_description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-chocolate-600 mb-6">
          <Link to="/" className="hover:text-chocolate-950">Home</Link>
          <span>/</span>
          <Link to="/cakes" className="hover:text-chocolate-950">Cakes</Link>
          <span>/</span>
          <span className="text-chocolate-900 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-cream-50 rounded-3xl p-6 sm:p-10 border border-cream-200/90 shadow-soft">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-200 shadow-md">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.best_seller && <Badge variant="bestseller">Best Seller</Badge>}
                {isEggless && <Badge variant="eggless">100% Eggless</Badge>}
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Purchase */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Reviews */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-gold-600">
                  {product.category}
                </span>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full border ${
                    isWishlisted
                      ? 'bg-blush-500 text-white border-blush-500'
                      : 'bg-cream-100 text-chocolate-700 border-cream-300'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-xs text-chocolate-600">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold ml-1 text-chocolate-900">{product.rating}</span>
                </div>
                <span>•</span>
                <span>{product.review_count} Verified Customer Reviews</span>
              </div>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-chocolate-950">
                ₹{currentPrice}
              </span>
              <span className="text-xs text-chocolate-500">
                (Inclusive of all taxes & temperature packing)
              </span>
            </div>

            <p className="text-sm text-chocolate-700 leading-relaxed">
              {product.description}
            </p>

            {/* Weight Selection */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-chocolate-900 uppercase tracking-wide">
                Select Cake Weight
              </label>
              <div className="grid grid-cols-4 gap-2">
                {weights.map((w) => (
                  <button
                    key={w.label}
                    onClick={() => setSelectedWeight(w.label)}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all ${
                      selectedWeight === w.label
                        ? 'bg-chocolate-900 text-cream-50 border-chocolate-900 shadow-sm'
                        : 'bg-cream-100 text-chocolate-800 border-cream-300 hover:border-chocolate-400'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavour Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-chocolate-900 uppercase tracking-wide">
                Select Flavour Infusion
              </label>
              <div className="flex flex-wrap gap-2">
                {flavours.map((flavour) => (
                  <button
                    key={flavour}
                    onClick={() => setSelectedFlavour(flavour)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border transition-all ${
                      selectedFlavour === flavour
                        ? 'bg-chocolate-900 text-cream-50 border-chocolate-900'
                        : 'bg-cream-100 text-chocolate-800 border-cream-300 hover:border-chocolate-400'
                    }`}
                  >
                    {flavour}
                  </button>
                ))}
              </div>
            </div>

            {/* Eggless Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-cream-100 border border-cream-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-chocolate-900">Make it 100% Eggless</span>
              </div>
              <input
                type="checkbox"
                checked={isEggless}
                onChange={(e) => setIsEggless(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Message on Cake */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-chocolate-900 uppercase tracking-wide">
                Piped Cake Message (Optional)
              </label>
              <input
                type="text"
                maxLength={35}
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="e.g. Happy 25th Birthday Rhea!"
                className="w-full px-4 py-2.5 rounded-2xl bg-cream-100 border border-cream-300 text-chocolate-900 text-xs focus:outline-none focus:border-chocolate-700"
              />
              <span className="text-[10px] text-chocolate-500">Max 35 characters</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4 border-t border-cream-200">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 gap-2"
              >
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <span>Add to Bakery Bag • ₹{currentPrice}</span>
              </Button>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-chocolate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-600" />
                <span>Baking time: ~3 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-600" />
                <span>Chilled shockproof delivery</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
