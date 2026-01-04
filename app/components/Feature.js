'use client';
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';

export default function Feature() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts('limit=10&productType=Featured&sort=-createdAt'));
  }, [dispatch]);

  // স্লাইডার কন্ট্রোল
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 1.5;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24 px-6 bg-bg relative overflow-hidden border-t border-border/10">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Neural selection
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Featured <span className="text-primary">Gear</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom Navigation */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 bg-card border border-border/50 rounded-xl hover:border-primary/50 hover:text-primary transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 bg-card border border-border/50 rounded-xl hover:border-primary/50 hover:text-primary transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <Link
              href="/shop?productType=Featured"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pText hover:text-primary transition-colors"
            >
              See Vault{' '}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* --- Single Line Slider Area --- */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x"
          >
            {loading ? (
              <Skeleton type="product" count={5} />
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="min-w-35 md:min-w-55 snap-start">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full py-20 text-center border border-dashed border-border/20 rounded-3xl">
                <p className="text-pText font-black uppercase tracking-widest opacity-30 text-sm italic">
                  No Featured Hardware Detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
