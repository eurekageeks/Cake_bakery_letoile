import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/product';
import { ProductCard } from '../product/ProductCard';

export const sampleBestSellers: Product[] = [
  {
    id: 'cake-1',
    name: 'Belgian Dark Chocolate Ganache Truffle Cake',
    slug: 'belgian-dark-chocolate-ganache-truffle-cake',
    short_description: 'Rich 70% Callebaut dark chocolate sponge layered with velvety whipped ganache and edible gold flakes.',
    description: 'Our crowned masterpiece. Baked with single-origin Callebaut Belgian chocolate, French butter, and delicate cocoa syrup.',
    base_price: 1099,
    discount_price: 899,
    discount_percent: 18,
    category: 'Chocolate Cakes',
    occasion: 'Birthday',
    rating: 4.9,
    review_count: 420,
    featured: true,
    best_seller: true,
    customizable: true,
    eggless_available: true,
    sugar_free_available: false,
    preparation_time_hours: 3,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'cake-2',
    name: 'Royal Red Velvet & Philadelphia Cream Cake',
    slug: 'royal-red-velvet-cream-cheese-cake',
    short_description: 'Classic crimson cocoa crumb layered with authentic Philadelphia cream cheese frosting.',
    description: 'Velvety, moist, and tangy. Crafted with Madagascar vanilla and smooth organic cream cheese.',
    base_price: 949,
    discount_price: 799,
    discount_percent: 15,
    category: 'Birthday Cakes',
    occasion: 'Anniversary',
    rating: 4.8,
    review_count: 310,
    featured: true,
    best_seller: true,
    customizable: true,
    eggless_available: true,
    sugar_free_available: false,
    preparation_time_hours: 3,
    image_url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'cake-3',
    name: 'Lotus Biscoff Speculoos Caramel Dream Cake',
    slug: 'lotus-biscoff-speculoos-caramel-cake',
    short_description: 'Spiced Belgian cookie butter sponge infused with crunchy Biscoff crumbles and caramel drizzle.',
    description: 'Irresistible crunch meets creamy caramel. Topped with whole Lotus Biscoff biscuits.',
    base_price: 1199,
    discount_price: 999,
    discount_percent: 16,
    category: 'Designer Cakes',
    occasion: 'Party',
    rating: 4.9,
    review_count: 280,
    featured: true,
    best_seller: true,
    customizable: true,
    eggless_available: true,
    sugar_free_available: false,
    preparation_time_hours: 4,
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'cake-4',
    name: 'Wild Blueberry Burnt Basque Cheesecake',
    slug: 'wild-blueberry-burnt-basque-cheesecake',
    short_description: 'Caramelized rustic Basque crust with a molten, ultra-creamy centre and wild blueberry compote.',
    description: 'Authentic San Sebastián recipe baked at high heat for maximum depth of flavor and velvety softness.',
    base_price: 1299,
    discount_price: 1099,
    discount_percent: 15,
    category: 'Cheesecakes',
    occasion: 'Birthday',
    rating: 5.0,
    review_count: 195,
    featured: true,
    best_seller: true,
    customizable: false,
    eggless_available: false,
    sugar_free_available: true,
    preparation_time_hours: 6,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
  },
];

export const BestSellersSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-gold-600 font-semibold text-xs tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
              Today's Best Sellers
            </h2>
            <p className="text-sm text-chocolate-600/90 mt-1">
              Our most celebrated cakes, freshly baked every 3 hours by master chocolatiers.
            </p>
          </div>
          
          <Link
            to="/cakes?filter=bestsellers"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-chocolate-800 hover:text-chocolate-950 transition-colors"
          >
            <span>Explore all best sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleBestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
