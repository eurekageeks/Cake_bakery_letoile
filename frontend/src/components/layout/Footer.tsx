import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, ShieldCheck, Heart, MapPin, Phone, Mail, Share2, Globe, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-chocolate-950 text-cream-200 pt-16 pb-12 border-t border-chocolate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-chocolate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-500 text-chocolate-950 flex items-center justify-center font-bold">
                <Cake className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">
                L'Étoile Pâtisserie
              </span>
            </Link>
            <p className="text-sm text-cream-300/80 leading-relaxed max-w-sm">
              Artisanal cakes, handcrafted viennoiserie, and celebratory confections baked fresh every morning with pure French butter, single-origin chocolate, and seasonal fruits.
            </p>
            <div className="flex items-center gap-4 pt-2 text-cream-400">
              <a href="#" className="p-2 rounded-full bg-chocolate-900 hover:text-gold-400 hover:bg-chocolate-800 transition-colors" aria-label="Social">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-chocolate-900 hover:text-gold-400 hover:bg-chocolate-800 transition-colors" aria-label="Chat">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-chocolate-900 hover:text-gold-400 hover:bg-chocolate-800 transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Bakery Menu</h4>
            <ul className="space-y-2 text-sm text-cream-300">
              <li><Link to="/cakes" className="hover:text-cream-50 transition-colors">Signature Cakes</Link></li>
              <li><Link to="/cakes?category=Bento+Cakes" className="hover:text-cream-50 transition-colors">Bento & Petite Cakes</Link></li>
              <li><Link to="/cakes?category=Cheesecakes" className="hover:text-cream-50 transition-colors">Artisan Cheesecakes</Link></li>
              <li><Link to="/cakes?eggless=true" className="hover:text-cream-50 transition-colors">100% Eggless Specials</Link></li>
              <li><Link to="/custom-cakes" className="hover:text-cream-50 transition-colors">Bespoke Custom Orders</Link></li>
            </ul>
          </div>

          {/* Occasions */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Occasions</h4>
            <ul className="space-y-2 text-sm text-cream-300">
              <li><Link to="/cakes?occasion=Birthday" className="hover:text-cream-50 transition-colors">Birthday Cakes</Link></li>
              <li><Link to="/cakes?occasion=Anniversary" className="hover:text-cream-50 transition-colors">Anniversary Cakes</Link></li>
              <li><Link to="/cakes?occasion=Wedding" className="hover:text-cream-50 transition-colors">Tiered Wedding Cakes</Link></li>
              <li><Link to="/cakes?occasion=Baby+Shower" className="hover:text-cream-50 transition-colors">Baby Showers & Revelry</Link></li>
              <li><Link to="/cakes?occasion=Festivals" className="hover:text-cream-50 transition-colors">Seasonal Hampers</Link></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Visit & Contact</h4>
            <ul className="space-y-2.5 text-xs text-cream-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>42 Boulevard des Gourmets, Bengaluru / Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98765 43210 / 080 44556677</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>bonjour@letoilepatisserie.com</span>
              </li>
              <li className="pt-2 text-[11px] text-cream-400">
                Baking Fresh: Mon - Sun | 8:00 AM - 11:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} L'Étoile Pâtisserie. Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 inline fill-rose-400" />
            <span>for sweet celebrations.</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-cream-300">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>100% Secure Razorpay & SSL 256-Bit</span>
            </div>
            <Link to="/admin" className="hover:text-gold-400 text-cream-400 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
