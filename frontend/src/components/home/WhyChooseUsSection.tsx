import React from 'react';
import { Sparkles, Clock, ShieldCheck, Heart, Palette, Leaf } from 'lucide-react';

const pillars = [
  {
    icon: Clock,
    title: 'Freshly Baked Daily',
    desc: 'Never frozen or pre-stored. Every order is baked from scratch within hours of delivery.',
    accent: 'bg-amber-100 text-amber-800',
  },
  {
    icon: Sparkles,
    title: 'Artisan Ingredients',
    desc: '100% pure Belgian Callebaut chocolate, Madagascar vanilla beans, and European cultured butter.',
    accent: 'bg-gold-100 text-gold-700',
  },
  {
    icon: Leaf,
    title: '100% Eggless Options',
    desc: 'Dedicated eggless baking stations maintaining impeccable softness and authentic crumb texture.',
    accent: 'bg-emerald-100 text-emerald-800',
  },
  {
    icon: Palette,
    title: 'Bespoke Customization',
    desc: 'Upload reference images, select flavor infusions, and customize messages for dream celebrations.',
    accent: 'bg-blush-100 text-blush-700',
  },
  {
    icon: ShieldCheck,
    title: 'Chilled Express Logistics',
    desc: 'Temperature-monitored, shock-absorbent cake boxes delivered safely in 3-hour slots.',
    accent: 'bg-blue-100 text-blue-800',
  },
  {
    icon: Heart,
    title: 'Satisfaction Guaranteed',
    desc: 'Over 50,000 satisfied cake lovers and 4.9★ ratings across Google & Zomato.',
    accent: 'bg-rose-100 text-rose-800',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream-50 border-y border-cream-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Our Quality Promise
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950 mt-2">
            Why Discerning Cake Lovers Choose L'Étoile
          </h2>
          <p className="text-sm text-chocolate-600/90 mt-2">
            Every layer is baked with precision, passion, and uncompromising culinary integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-cream-100/90 rounded-3xl p-6 border border-cream-200/90 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.accent} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-chocolate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-chocolate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
