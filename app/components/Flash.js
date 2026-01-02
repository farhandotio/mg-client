'use client';
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/context/data';

export default function Flash() {

  return (
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black text-text tracking-tight uppercase">
                Flash Deals
              </h2>
              {/* Limited Time Badge with Glow Effect */}
              <div className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(41,252,86,0.3)]">
                <Zap size={14} className="text-primary fill-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-wider">
                  Limited Time
                </span>
              </div>
            </div>
            <p className="text-pText font-medium">Don't miss out on these incredible offers</p>
          </div>

          {/* All Deals Button */}
          <button className="flex items-center gap-2 bg-primary text-bg px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-[0_10px_20px_-5px_rgba(41,252,86,0.4)]">
            All Deals <ArrowRight size={18} />
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
