import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '../components/home/HeroSection';
import { OccasionsSection } from '../components/home/OccasionsSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: "L'Étoile Artisan Pâtisserie",
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    description: 'Artisanal online bakery specializing in freshly baked handcrafted celebration cakes, cheesecakes, bento cakes, and custom cakes with 3-hour express delivery.',
    priceRange: '₹₹',
    servesCuisine: 'French Bakery, Desserts, Artisan Cakes',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '15400',
    },
  };

  return (
    <>
      <Helmet>
        <title>L'Étoile Pâtisserie | Luxury Artisan Cakes & Same-Day Delivery</title>
        <meta
          name="description"
          content="Order freshly baked artisan cakes online. Pure Belgian chocolate, French butter, 100% eggless options, custom cakes, and express 3-hour doorstep delivery."
        />
        <meta property="og:title" content="L'Étoile Pâtisserie | Luxury Artisan Cakes" />
        <meta
          property="og:description"
          content="Make every celebration sweeter with artisanal handcrafted cakes baked fresh daily."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        <HeroSection />
        <OccasionsSection />
        <CategoriesSection />
        <BestSellersSection />
        <WhyChooseUsSection />
        <CustomerReviewsSection />
        <NewsletterSection />
      </main>
    </>
  );
};
