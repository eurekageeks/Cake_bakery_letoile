import React from 'react';
import { Sparkles, Clock, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-chocolate-900 text-cream-100 text-xs py-2 px-4 border-b border-chocolate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-medium">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 animate-pulse" />
          <span>Handcrafted with 100% Organic Butter & Pure Belgian Cocoa</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-cream-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gold-400" />
            <span>Same-Day 3-Hour Delivery Available</span>
          </div>
          <span className="text-chocolate-600">•</span>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3 h-3 text-gold-400" />
            <span>Free Delivery on Orders over ₹999</span>
          </div>
        </div>
      </div>
    </div>
  );
};
