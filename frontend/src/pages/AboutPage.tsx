import React from 'react';
import { Helmet } from 'react-helmet-async';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-14 bg-cream-100 min-h-screen">
      <Helmet>
        <title>About Our Artisan Bakery | L'Étoile Pâtisserie</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-600">The Story of L'Étoile</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
            Artistry in Every Crumb
          </h1>
          <p className="text-base text-chocolate-700/90 leading-relaxed max-w-2xl mx-auto">
            Founded with a singular devotion to European confectionery mastery, L'Étoile fuses classic French patisserie techniques with celebratory Indian warmth.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-card aspect-[16/9] bg-chocolate-900">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop"
            alt="Chef decorating artisan cake"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-cream-50 rounded-3xl p-8 sm:p-10 border border-cream-200/90 shadow-soft space-y-6 text-sm text-chocolate-800 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-chocolate-950">
            Our Baking Philosophy
          </h2>
          <p>
            We believe that a celebration cake is not just dessert — it is the centerpiece of life's most unforgettable milestones. That is why we refuse shortcuts: no artificial emulsifiers, no hydrogenated fats, and no pre-frozen sponges.
          </p>
          <p>
            From small-batch vanilla extracts matured for six months to 70% dark Belgian cocoa couvertures, every ingredient is ethically sourced and rigorously tested for flavor purity.
          </p>
        </div>
      </div>
    </div>
  );
};
