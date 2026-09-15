import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Ananya Deshmukh',
    role: 'Verified Buyer',
    location: 'Indiranagar, Bengaluru',
    rating: 5,
    title: 'Pure indulgence! Best chocolate truffle in India',
    content: 'Ordered the Belgian Truffle Noir for my fiancé’s 30th birthday. The texture was velvety, not overwhelmingly sweet, and arrived in perfect temperature packaging in exactly 2.5 hours!',
    cake: 'Belgian Dark Chocolate Ganache Truffle',
  },
  {
    name: 'Vikram Malhotra',
    role: 'Verified Buyer',
    location: 'Bandra West, Mumbai',
    rating: 5,
    title: 'The eggless cheesecake was mindblowing',
    content: 'My mother is strictly vegetarian, so finding an authentic Basque cheesecake that is 100% eggless and still melts in the mouth felt impossible until we ordered from L’Étoile.',
    cake: 'Wild Blueberry Basque Cheesecake',
  },
  {
    name: 'Pooja & Rohan Iyer',
    role: 'Verified Buyer',
    location: 'Koramangala, Bengaluru',
    rating: 5,
    title: 'Bespoke Anniversary Masterpiece',
    content: 'Uploaded a custom Pinterest reference photo for our 5th anniversary. The pastry chef replicated the delicate gold foil and sugar roses flawlessly. Our guests were blown away!',
    cake: 'Bespoke 2-Tier Red Velvet Rose',
  },
];

export const CustomerReviewsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-chocolate-800 ml-2">4.9 / 5.0 (15,000+ Reviews)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
            Loved by Celebrators & Connoisseurs
          </h2>
          <p className="text-sm text-chocolate-600/90 mt-2">
            Real experiences from customers making life’s happiest moments a little sweeter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-cream-50 rounded-3xl p-6 sm:p-7 border border-cream-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-gold-400/60" />
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-bold text-chocolate-900 leading-snug">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-chocolate-700 leading-relaxed">
                  {rev.content}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-cream-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-chocolate-900 flex items-center gap-1.5">
                      <span>{rev.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div className="text-[11px] text-chocolate-500">{rev.location}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-chocolate-600 bg-cream-200 px-2 py-0.5 rounded-full">
                    {rev.role}
                  </span>
                </div>
                <div className="text-[11px] text-gold-700 font-medium mt-2">
                  Ordered: {rev.cake}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
