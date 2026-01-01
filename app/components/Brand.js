'use client';
import React from 'react';

export default function Brand() {
  const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'Microsoft', 'Razer', 'Bose', 'LG'];

  return (
    <section className="py-16 bg-bg border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <p className="text-pText text-xs font-bold uppercase tracking-[0.2em] opacity-70">
            Trusted by the world's leading brands
          </p>
        </div>

        {/* Brands List/Grid */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20">
          {brands.map((brand, index) => (
            <div key={index} className="group cursor-default">
              <h3 className="text-pText text-2xl md:text-3xl font-bold transition-all duration-300 group-hover:text-text group-hover:scale-110 opacity-40 group-hover:opacity-100">
                {brand}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
