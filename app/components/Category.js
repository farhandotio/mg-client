'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '@/store/features/categorySlice';
import { Loader2, ArrowRight, ArrowLeft, ScanLine } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';

export default function Category() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 animate-pulse">
          Scanning Nodes...
        </span>
      </div>
    );

  return (
    <section className="py-24 bg-bg relative overflow-hidden">
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-border/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-primary">
              <ScanLine size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Index / 004</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Cyber <span className="text-primary">Categories</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-4 border border-border/40 rounded-2xl hover:bg-primary hover:text-bg transition-all duration-500 group"
              >
                <ArrowLeft size={20} className="group-active:-translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-4 border border-border/40 rounded-2xl hover:bg-primary hover:text-bg transition-all duration-500 group"
              >
                <ArrowRight size={20} className="group-active:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider Wrapper */}
        <div className="relative group/slider">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
          >
            {categories.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="shrink-0 w-28 md:w-44 snap-start"
              >
                <Link href={`/shop?category=${item.slug}`} className="group block space-y-4">
                  {/* Image Block */}
                  <div className="relative aspect-3/2 rounded-2xl overflow-hidden bg-card/20 border border-border/30 group-hover:border-primary/50 transition-all duration-500">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />

                    <img
                      src={item.image?.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />

                    {/* Minimal Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-bg via-transparent to-transparent opacity-80" />

                    {/* ID Badge */}
                    <div className="absolute top-4 left-4 text-[8px] font-black text-white/20 group-hover:text-primary transition-colors">
                      CAT_{idx + 1}
                    </div>
                  </div>

                  {/* Label Block */}
                  <div className="px-1 space-y-1">
                    <h3 className="text-text font-black uppercase text-[10px] md:text-sm tracking-widest group-hover:text-primary transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="h-1 w-4 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Fade linear Ends (Desktop) */}
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-linear-to-l from-bg to-transparent pointer-events-none hidden md:block" />
        </div>
      </div>
    </section>
  );
}
