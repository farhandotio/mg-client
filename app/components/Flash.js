'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Zap, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';

export default function Flash() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const { products, loading } = useSelector((state) => state.products);

  // কাউন্টডাউন টাইমার স্টেট
  const [timeLeft, setTimeLeft] = useState({ hours: '00', mins: '00', secs: '00' });

  useEffect(() => {
    // শুধুমাত্র FlashSale এবং ম্যাক্স ১০টি প্রোডাক্ট
    dispatch(fetchAllProducts('limit=10&productType=FlashSale&sort=-createdAt'));

    // টাইমার লজিক
    const timer = setInterval(() => {
      const now = new Date();
      const h = 23 - now.getHours();
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

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
      {/* Background Decor - Reddish/Orange Glow for Flash vibe */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Zap size={16} className="animate-pulse fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Limited Protocol
                </span>
              </div>
              {/* Mini Countdown Display */}
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Timer size={12} />
                <span>
                  {timeLeft.hours}:{timeLeft.mins}:{timeLeft.secs}
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Flash <span className="text-primary">Deals</span>
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
              href="/shop?productType=FlashSale"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pText hover:text-primary transition-colors"
            >
              All Deals{' '}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* --- Slider Area --- */}
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
                <p className="text-pText font-black uppercase tracking-widest opacity-30 text-sm italic text-center mx-auto">
                  No Active Flash Signals Detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
