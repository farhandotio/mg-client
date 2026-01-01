'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function Best() {
  // স্ক্রিনশট অনুযায়ী ডামি ডাটা
  const bestSellers = [
    {
      _id: 'b1',
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
      _id: 'b2',
      title: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'Smartphones',
      price: { base: 1299 },
      rating: 4.7,
      numReviews: 3245,
      isBestSeller: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
    {
      _id: 'b3',
      title: 'Razer DeathAdder V3 Pro',
      brand: 'Razer',
      category: 'Gaming',
      price: { base: 149 },
      rating: 4.5,
      numReviews: 3421,
      isBestSeller: true,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
        },
      ],
    },
    {
      _id: 'b4',
      title: 'AirPods Pro 2',
      brand: 'Apple',
      category: 'Headphones',
      price: { base: 249 },
      rating: 4.8,
      numReviews: 12453,
      isBestSeller: true,
      images: [
        {
          url: 'https://imgs.search.brave.com/H0VtYeW6Hjq5xQKkpAMKiRmG2QGBUZN1-hoODcILNNM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y25ldC5jb20vYS9p/bWcvcmVzaXplL2Rj/YzFjMmQwMjdlYzNm/MGM0NmQ2ODA4YWMy/YmUwN2MwOGY4MTJl/OTIvaHViLzIwMjQv/MDkvMTYvNjMxOTZl/MDEtYTk2NC00MjA2/LThjM2QtMGNkMzMz/NWIzNjBkL2FwcGxl/LWFpcnBvZHMtNC03/LmpwZz9hdXRvPXdl/YnAmaGVpZ2h0PTUw/MA',
        },
      ],
    },
  ];

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
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
