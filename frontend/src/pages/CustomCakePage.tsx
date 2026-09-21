import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CustomCakePage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-cream-100 min-h-screen">
      <Helmet>
        <title>Bespoke Custom Cake Studio | L'Étoile Pâtisserie</title>
        <meta name="description" content="Upload reference photos and design your dream celebration cake with our master pastry chefs." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream-200 text-chocolate-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Bespoke Design Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
            Design Your Dream Cake
          </h1>
          <p className="text-sm text-chocolate-600/90 mt-2">
            Upload Pinterest or Instagram references, specify flavor profiles, and our master decorators will bring your confection vision to reality.
          </p>
        </div>

        <div className="bg-cream-50 rounded-3xl p-6 sm:p-10 border border-cream-200/90 shadow-soft">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-chocolate-900">
                Custom Cake Request Received!
              </h2>
              <p className="text-sm text-chocolate-600 max-w-md mx-auto">
                Our head pastry chef is reviewing your reference design. We will call you at your provided phone number with a 3D mock preview and custom quote within 60 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate-900 uppercase">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-cream-300 text-xs focus:outline-none focus:border-chocolate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate-900 uppercase">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-cream-300 text-xs focus:outline-none focus:border-chocolate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate-900 uppercase">Target Event Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-cream-300 text-xs focus:outline-none focus:border-chocolate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-chocolate-900 uppercase">Estimated Guests / Weight</label>
                  <select className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-cream-300 text-xs focus:outline-none focus:border-chocolate-700">
                    <option>1.0 KG (4-6 Guests)</option>
                    <option>2.0 KG (10-14 Guests)</option>
                    <option>3.0 KG Tiered (20-25 Guests)</option>
                    <option>5.0+ KG Wedding Tier (40+ Guests)</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Upload Reference Photo</label>
                <div className="border-2 border-dashed border-cream-300 hover:border-chocolate-500 rounded-3xl p-8 text-center bg-cream-100/50 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-chocolate-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-chocolate-800">
                    Click to upload or drag and drop image
                  </div>
                  <div className="text-[11px] text-chocolate-500 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-chocolate-900 uppercase">Special Instructions & Flavor Notes</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the theme, color palette, custom tier flavors, or any allergies..."
                  className="w-full px-4 py-3 rounded-2xl bg-cream-100 border border-cream-300 text-xs focus:outline-none focus:border-chocolate-700"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Custom Cake Request</span>
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
