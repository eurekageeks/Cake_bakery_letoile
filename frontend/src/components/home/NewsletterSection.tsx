import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-chocolate-900 text-cream-100 relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blush-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-chocolate-800 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-chocolate-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Pâtisserie Club</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
          Join for ₹150 Off Your First Artisan Cake
        </h2>

        <p className="text-sm sm:text-base text-cream-300 max-w-xl mx-auto mt-3 mb-8 leading-relaxed">
          Be the first to savor exclusive seasonal drop releases, secret chef recipes, and celebratory member perks.
        </p>

        {submitted ? (
          <div className="p-6 rounded-3xl bg-chocolate-800/80 border border-chocolate-700 max-w-md mx-auto flex items-center justify-center gap-3 text-gold-300">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div className="text-left">
              <div className="font-bold text-sm text-cream-100">Welcome to the Club!</div>
              <div className="text-xs text-cream-300">Use code <span className="font-mono text-gold-400 font-bold">SWEET150</span> at checkout.</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-5 h-5 text-chocolate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-chocolate-950 border border-chocolate-700 text-cream-100 placeholder:text-chocolate-400 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto shrink-0">
              Claim ₹150
            </Button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-cream-400">
          <span>🔒 No spam ever</span>
          <span>•</span>
          <span>Instant coupon code</span>
          <span>•</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>
    </section>
  );
};
