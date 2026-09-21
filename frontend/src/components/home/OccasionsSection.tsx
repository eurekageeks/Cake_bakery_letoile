import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';

const occasions = [
  {
    name: 'Birthdays',
    tagline: 'Festive sprinkles & pinata cakes',
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=800&auto=format&fit=crop',
    query: 'Birthday',
    color: 'from-amber-950/70',
  },
  {
    name: 'Anniversaries',
    tagline: 'Romantic red velvets & florals',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    query: 'Anniversary',
    color: 'from-rose-950/70',
  },
  {
    name: 'Weddings',
    tagline: 'Multi-tiered bespoke creations',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop',
    query: 'Wedding',
    color: 'from-chocolate-950/70',
  },
  {
    name: 'Baby Showers',
    tagline: 'Pastel clouds & gender reveals',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop',
    query: 'Baby Shower',
    color: 'from-sky-950/70',
  },
  {
    name: 'Festivals',
    tagline: 'Diwali, Christmas & New Year',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop',
    query: 'Festivals',
    color: 'from-emerald-950/70',
  },
  {
    name: "Valentine's & Romance",
    tagline: 'Heart-shaped chocolate drips',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
    query: "Valentine's",
    color: 'from-pink-950/70',
  },
];

export const OccasionsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-gold-600 font-semibold text-xs tracking-widest uppercase mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Celebrate Every Milestone</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
              Shop by Occasion
            </h2>
          </div>
          <Link
            to="/occasions"
            className="group flex items-center gap-2 text-sm font-semibold text-chocolate-800 hover:text-chocolate-950 transition-colors"
          >
            <span>View all occasions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {occasions.map((item) => (
            <Link
              key={item.name}
              to={`/cakes?occasion=${encodeURIComponent(item.query)}`}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-soft hover:shadow-card transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-black/20 to-transparent`} />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-cream-50">
                <span className="text-[10px] text-gold-300 font-medium tracking-wide uppercase">Occasion</span>
                <h3 className="font-serif text-lg font-bold leading-tight drop-shadow-sm">
                  {item.name}
                </h3>
                <p className="text-[11px] text-cream-200/90 line-clamp-1 mt-0.5">
                  {item.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
