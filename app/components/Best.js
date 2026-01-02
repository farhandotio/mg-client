'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/context/data';

export default function Best() {
  return (
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-text tracking-tight uppercase">Best Sellers</h2>
            <p className="text-pText font-medium">Top-rated products loved by our customers</p>
          </div>

          <button className="flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-2xl text-text font-bold hover:border-primary/50 hover:bg-white/5 transition-all group">
            View All{' '}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
