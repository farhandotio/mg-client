import React from 'react';
import Hero from './components/Hero';
import Category from './components/Category';
import Feature from './components/Feature';
import Flash from './components/Flash';
import Best from './components/Best';
import Brand from './components/Brand';
import TrustSection from './components/TrustSection';

export default function page() {
  return (
    <div className="max-w-7xl mx-auto">
      <Hero />
      <Category />
      <Feature />
      <Flash />
      <Best />
      <TrustSection />
      <Brand />
    </div>
  );
}
