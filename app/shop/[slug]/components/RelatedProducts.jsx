'use client';
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function RelatedProducts({ products, currentId }) {
  const scrollRef = useRef(null);

  // বর্তমান প্রোডাক্ট বাদ দিয়ে ফিল্টার করা
  const filteredProducts = products?.filter((p) => p._id !== currentId);

  if (!filteredProducts?.length) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mt-32 relative">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={14} className="animate-pulse fill-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              Compatible Units
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-text tracking-tighter uppercase italic leading-none">
            Related <span className="text-primary">Gear</span>
          </h2>
        </div>

        {/* Slider Controls */}
        <div className="flex gap-2">
          <button
            aria-label="scroll left"
            onClick={() => scroll('left')}
            className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-all active:scale-90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="scroll right"
            onClick={() => scroll('right')}
            className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-all active:scale-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* --- Slider Area: Consistent with Other Sections --- */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-6"
        >
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="min-w-[65%] sm:min-w-[35%] md:min-w-[28%] lg:min-w-[19%] snap-start"
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
    </div>
  );
}
