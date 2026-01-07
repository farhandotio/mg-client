'use client';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '@/store/features/categorySlice';
import { ChevronRight, LayoutGrid, Zap, Fingerprint } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';

export default function Category() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // স্মুথ টপ স্ক্রল ফাংশন
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <section className="pt-26 pb-12 bg-bg border-b border-border/10 relative overflow-hidden">
      {/* Background Decor - Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(var(--primary-rgb),0.02),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Header Area: Left Aligned --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Fingerprint size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Initialize: Quick_Scan
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text tracking-tighter uppercase italic leading-none">
              Node <span className="text-primary">Sectors</span>
            </h2>
          </div>

          <Link
            href="/shop"
            onClick={handleScrollToTop}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-pText hover:text-primary transition-all bg-card px-4 py-2 rounded-full border border-border/50"
          >
            Access All Units
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Unique Geometric Categories --- */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar py-6 scroll-smooth"
        >
          {loading ? (
            <Skeleton type="category" count={8} className="w-24 h-24 md:w-32 md:h-32" />
          ) : categories && categories.length > 0 ? (
            categories.map((item) => (
              <Link
                key={item._id}
                href={`/shop?category=${item.slug}`}
                onClick={handleScrollToTop}
                className="group flex flex-col items-center shrink-0 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Slanted Hexagonal Container */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                  {/* Outer Cyber Shape */}
                  <div className="absolute inset-0 bg-card border border-border/40 clip-path-hex transition-all duration-500 group-hover:border-primary/60 group-hover:bg-primary/5 group-hover:rotate-12" />

                  {/* Inner Image Area */}
                  <div className="relative w-[85%] h-[85%] clip-path-hex overflow-hidden bg-bg/50 border border-border/20 transition-transform duration-500 group-hover:-rotate-12">
                    <img
                      src={item.image?.url || '/api/placeholder/200/200'}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 grayscale-[0.5] group-hover:grayscale-0"
                    />
                    {/* Dark Overlay with Icon */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Zap size={20} className="text-bg fill-primary animate-bounce" />
                    </div>
                  </div>

                  {/* Aesthetic Corner Tag */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                    <Zap size={10} fill="currentColor" className="text-bg" />
                  </div>
                </div>

                {/* Text Layout */}
                <div className="mt-6 text-center">
                  <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-pText group-hover:text-text transition-colors">
                    {item.name}
                  </h3>
                  <div className="h-0.5 w-0 group-hover:w-full bg-primary mx-auto mt-1 transition-all duration-500" />
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full py-10 opacity-20 italic font-black uppercase tracking-widest">
              Scanning for active sectors...
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .clip-path-hex {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
      `}</style>
    </section>
  );
}
