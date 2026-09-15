import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowUpDown, Cake, X } from 'lucide-react';
import { productService } from '../services/product.service';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { sampleBestSellers } from '../components/home/BestSellersSection';

export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [egglessOnly, setEgglessOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const categories = [
    'All',
    'Chocolate Cakes',
    'Birthday Cakes',
    'Bento Cakes',
    'Cheesecakes',
    'Designer Cakes',
    'Eggless Cakes',
    'Sugar-Free Cakes',
  ];

  const occasions = ['All', 'Birthday', 'Anniversary', 'Wedding', 'Baby Shower', 'Party', 'Festivals'];

  // TanStack Query for live API products
  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory, selectedOccasion, egglessOnly, search, sortBy],
    queryFn: () =>
      productService.getProducts({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        occasion: selectedOccasion !== 'All' ? selectedOccasion : undefined,
        eggless: egglessOnly ? true : undefined,
        search: search.trim() ? search.trim() : undefined,
        sort_by: sortBy,
      }),
  });

  // Fallback to local sample cakes if offline
  const products =
    apiResponse?.data && apiResponse.data.length > 0
      ? apiResponse.data
      : isError || !apiResponse
      ? sampleBestSellers.filter((p) => {
          if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
          if (selectedOccasion !== 'All' && p.occasion !== selectedOccasion) return false;
          if (egglessOnly && !p.eggless_available) return false;
          if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
          return true;
        })
      : apiResponse.data || [];

  return (
    <div className="py-10 bg-cream-100 min-h-screen">
      <Helmet>
        <title>Artisanal Cake Catalog | L'Étoile Pâtisserie</title>
        <meta name="description" content="Browse handcrafted luxury cakes, cheesecakes, bento cakes, and custom orders." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold-600">
              Fresh Daily Bakes
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 mt-1">
              The Artisan Cake Collection
            </h1>
            <p className="text-xs sm:text-sm text-chocolate-600/90 mt-1">
              Baked fresh to order with organic butter and pure Belgian Callebaut chocolate.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search truffle, biscoff, bento..."
              className="w-full pl-11 pr-8 py-2.5 rounded-full bg-cream-50 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-chocolate-700 shadow-soft"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-chocolate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-cream-50 p-4 sm:p-5 rounded-3xl border border-cream-200/90 shadow-soft space-y-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                    : 'bg-cream-200 text-chocolate-800 hover:bg-cream-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Occasion, Eggless, Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-cream-200/70 text-xs">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Occasion Filter */}
              <div className="flex items-center gap-1.5 bg-cream-100 px-3 py-1.5 rounded-2xl border border-cream-300">
                <span className="text-chocolate-500 font-medium">Occasion:</span>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="bg-transparent font-bold text-chocolate-900 focus:outline-none cursor-pointer"
                >
                  {occasions.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              {/* Eggless Toggle */}
              <button
                onClick={() => setEgglessOnly(!egglessOnly)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border font-bold transition-all ${
                  egglessOnly
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-cream-100 text-chocolate-700 border-cream-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${egglessOnly ? 'bg-emerald-600' : 'bg-gray-400'}`} />
                <span>100% Eggless Only</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-chocolate-500" />
              <span className="text-chocolate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream-100 border border-cream-300 rounded-2xl px-3 py-1.5 font-bold text-chocolate-900 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Chef's Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated (★)</option>
                <option value="newest">Newest Creations</option>
              </select>
            </div>

          </div>

        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-cream-50 rounded-3xl p-4 border border-cream-200 space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-cream-50 rounded-3xl p-12 text-center border border-cream-200/90 shadow-soft max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-chocolate-400 mx-auto">
              <Cake className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-chocolate-950">No cakes found</h3>
            <p className="text-xs text-chocolate-600">
              No matching cakes found for your current filter selections. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedOccasion('All');
                setEgglessOnly(false);
                setSearch('');
              }}
              className="px-5 py-2 rounded-full bg-chocolate-900 text-cream-50 text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
