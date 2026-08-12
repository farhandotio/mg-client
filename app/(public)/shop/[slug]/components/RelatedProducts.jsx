'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function RelatedProducts({ products, currentId }) {
  // বর্তমান প্রোডাক্ট বাদ দেওয়া এবং সর্বোচ্চ ১০টি প্রোডাক্ট নেওয়া
  const filteredProducts = products?.filter((p) => p._id !== currentId).slice(0, 10);

  if (!filteredProducts?.length) return null;

  return (
    <div className="relative">
      {/* --- Header Section --- */}
      <div className="flex flex-col mb-8 gap-3">
        <div className="flex items-center gap-2 text-secondary">
          <Sparkles size={14} className="animate-pulse fill-secondary" />
          <span className="text-[11px] font-medium uppercase tracking-tighter">আপনার জন্য আরও</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-medium text-text tracking-tighterer uppercase italic leading-none">
          সম্পর্কিত <span className="text-secondary">পণ্যসমূহ</span>
        </h2>
      </div>

      {/* --- Grid Layout: Mobile 2, Desktop 5 --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts.map((item, index) => (
          <div key={item._id} className="w-full">
            <ProductCard product={item} priority={index < 5} />
          </div>
        ))}
      </div>

      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
