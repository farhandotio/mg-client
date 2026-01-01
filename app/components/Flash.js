'use client';
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function Flash() {
  // স্ক্রিনশট অনুযায়ী ডামি ডাটা
  const flashProducts = [
    {
      _id: 'f1',
      title: 'Sony WH-1000XM5',
      brand: 'Sony',
      category: 'Headphones',
      price: { base: 349, original: 399 },
      rating: 4.7,
      numReviews: 4521,
      isBestSeller: true,
      discountPercentage: 13,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
    {
      _id: 'f2',
      title: 'Amazon Echo Show 10',
      brand: 'Amazon',
      category: 'Smart-Home',
      price: { base: 249, original: 299 },
      rating: 4.5,
      numReviews: 2156,
      discountPercentage: 17,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
    {
      _id: 'f3',
      title: 'Dell XPS 15',
      brand: 'Dell',
      category: 'Laptops',
      price: { base: 1899, original: 2099 },
      rating: 4.6,
      numReviews: 1823,
      discountPercentage: 10,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
    {
      _id: 'f4',
      title: 'Samsung Galaxy Watch 6',
      brand: 'Samsung',
      category: 'Smartwatches',
      price: { base: 329, original: 379 },
      rating: 4.5,
      numReviews: 987,
      discountPercentage: 13,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
  ];

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
          {flashProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
