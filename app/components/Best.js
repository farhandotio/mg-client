'use client';
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Flame, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';

export default function Best() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  // Redux state থেকে ডাটা আনা
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // মডেল অনুযায়ী BestSeller এবং সোল্ড কাউন্ট অনুযায়ী সর্টিং
    dispatch(fetchAllProducts('limit=10&productType=BestSeller&sort=-sold'));
  }, [dispatch]);

  // স্লাইডার কন্ট্রোল ফাংশন
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
      {/* Background Decor - Blueish/Secondary Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Flame size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Elite performance
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Best <span className="text-primary">Sellers</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom Navigation */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 bg-card border border-border/50 rounded-xl hover:border-primary/50 hover:text-primary transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 bg-card border border-border/50 rounded-xl hover:border-primary/50 hover:text-primary transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <Link
              href="/shop?productType=BestSeller"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pText hover:text-primary transition-colors"
            >
              Ranking List{' '}
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
              /* লোডিং অবস্থায় আপনার সেন্ট্রালাইজড স্কেলিটন */
              <Skeleton type="product" count={5} />
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="min-w-35 md:min-w-55 snap-start">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              /* এম্পটি স্টেট */
              <div className="w-full py-20 text-center border border-dashed border-border/20 rounded-3xl">
                <div className="flex flex-col items-center gap-2 opacity-30 italic">
                  <TrendingUp size={24} />
                  <p className="text-pText font-black uppercase tracking-widest text-xs">
                    No High-Traffic Hardware Found
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
