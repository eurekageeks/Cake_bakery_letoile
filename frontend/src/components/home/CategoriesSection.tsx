import React from 'react';
import { Link } from 'react-router-dom';
import type { CakeCategory } from '../../types/product';
import { Layers } from 'lucide-react';

interface CategoryCardItem {
  title: CakeCategory;
  count: string;
  image: string;
  badge?: string;
}

const categories: CategoryCardItem[] = [
  {
    title: 'Chocolate Cakes',
    count: '18 Varieties',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    badge: 'Popular',
  },
  {
    title: 'Birthday Cakes',
    count: '24 Varieties',
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Bento Cakes',
    count: '12 Varieties',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?q=80&w=800&auto=format&fit=crop',
    badge: 'Trending',
  },
  {
    title: 'Cheesecakes',
    count: '10 Varieties',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Designer Cakes',
    count: '15 Varieties',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    badge: 'Bespoke',
  },
  {
    title: 'Photo Cakes',
    count: '8 Varieties',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Eggless Cakes',
    count: '32 Varieties',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop',
    badge: '100% Pure',
  },
  {
    title: 'Cupcakes',
    count: '14 Varieties',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Sugar-Free Cakes',
    count: '6 Varieties',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop',
    badge: 'Healthy',
  },
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-chocolate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-gold-600" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
            Shop by Category
          </h2>
          <p className="text-sm text-chocolate-600/90 mt-2">
            Explore our handcrafted range of freshly baked luxury cakes, bento boxes, cheesecakes, and dietary specialties.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={`/cakes?category=${encodeURIComponent(cat.title)}`}
              className="group relative bg-cream-100 rounded-3xl p-3 sm:p-4 border border-cream-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
            >
              {/* Category Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-cream-200 relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col flex-grow">
                {cat.badge && (
                  <span className="text-[10px] font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded-md self-start mb-1 border border-gold-200">
                    {cat.badge}
                  </span>
                )}
                <h3 className="font-serif text-base sm:text-lg font-bold text-chocolate-900 group-hover:text-chocolate-700 transition-colors leading-tight">
                  {cat.title}
                </h3>
                <span className="text-xs text-chocolate-500 font-medium mt-1">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
