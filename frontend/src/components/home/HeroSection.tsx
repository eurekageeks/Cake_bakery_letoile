import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock, Award, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-cream-200/80">
      {/* Subtle Warm Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blush-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-200 border border-cream-300/80 shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-xs font-semibold tracking-wide uppercase text-chocolate-800">
                Artisanal Handcrafted Pâtisserie
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-chocolate-950 tracking-tight leading-[1.15] text-balance">
              Make Every Celebration <span className="italic font-normal text-chocolate-800">Sweeter.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-chocolate-700/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Freshly baked luxury cakes made with organic French butter, pure Belgian chocolate, and real vanilla bean. Hand-delivered across the city in 3 hours.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/cakes">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-card group">
                  <span>Explore Signature Cakes</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/custom-cakes">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <span>Custom Cake Studio</span>
                </Button>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-cream-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-chocolate-900">3-Hour Delivery</div>
                  <div className="text-[11px] text-chocolate-500">Same-day slots</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-chocolate-900">100% Eggless</div>
                  <div className="text-[11px] text-chocolate-500">Available across menu</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blush-100 text-blush-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-chocolate-900">50k+ Happy</div>
                  <div className="text-[11px] text-chocolate-500">4.9★ Google rated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-cream-50 aspect-[4/5] group bg-chocolate-900">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
                  alt="Belgian Dark Chocolate Ganache Truffle Cake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/80 via-transparent to-black/20" />
                
                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-cream-50/95 backdrop-blur-md border border-cream-200/80 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600">Chef's Signature</span>
                      <h4 className="font-serif text-base font-bold text-chocolate-900">Belgian Truffle Noir</h4>
                      <p className="text-xs text-chocolate-600">70% Callebaut Dark Chocolate & Gold Dust</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-chocolate-950">₹899</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Ready in 3h</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3 rounded-2xl bg-cream-50 border border-cream-200 shadow-card flex items-center gap-3 animate-slide-up">
                <div className="w-10 h-10 rounded-full bg-blush-200 flex items-center justify-center text-blush-600">
                  <Heart className="w-5 h-5 fill-blush-500" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-chocolate-900">"Best Cake in Town!"</div>
                  <div className="text-[11px] text-chocolate-500">Over 15,000 Verified Reviews</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
