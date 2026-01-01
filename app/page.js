import React from 'react';
import Hero from './components/Hero';
import Category from './components/Category';
import Feature from './components/Feature';
import Flash from './components/Flash';
import Best from './components/Best';

export default function page() {
  return (
    <div>
      <Hero />
      <Category />
      <Feature />
      <Flash />
      <Best />
    </div>
  );
}
