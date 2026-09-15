import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';

export const WishlistPage: React.FC = () => {
  const { items } = useWishlistStore();

  return (
    <div className="py-12 bg-cream-100 min-h-screen">
      <Helmet>
        <title>My Wishlist | L'Étoile Pâtisserie</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-chocolate-950">
            Saved Celebration Cakes ({items.length})
          </h1>
          <p className="text-sm text-chocolate-600 mt-1">
            Your personal wishlist of favorite artisan cakes and treats.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-cream-50 rounded-3xl p-12 text-center border border-cream-200/90 shadow-soft max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-chocolate-400 mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-chocolate-900">Your wishlist is empty</h2>
            <p className="text-xs text-chocolate-600">
              Save cakes you love to order later for birthdays, anniversaries, and holidays.
            </p>
            <Link to="/cakes">
              <Button variant="primary" size="md">
                Browse Cakes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
