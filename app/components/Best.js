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
  const { bestSellerProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts('limit=10&productType=BestSeller&sort=-sold'));
  }, [dispatch]);

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
    <section className="py-10 px-4 md:px-6 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Flame size={14} className="animate-pulse fill-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                Elite performance
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Best <span className="text-primary">Sellers</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-all active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-all active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Link
              href="/shop?productType=BestSeller"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pText hover:text-primary"
            >
              Ranking List{' '}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto py-5 no-scrollbar scroll-smooth snap-x snap-mandatory pb-6"
          >
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[65%] sm:min-w-[35%] md:min-w-[28%] lg:min-w-[19%] snap-start"
                >
                  <Skeleton type="product" />
                </div>
              ))
            ) : bestSellerProducts && bestSellerProducts.length > 0 ? (
              bestSellerProducts.map((product) => (
                <div
                  key={product._id}
                  className="min-w-[65%] sm:min-w-[35%] md:min-w-[28%] lg:min-w-[19%] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full py-16 text-center border border-dashed border-border/10 rounded-2xl">
                <div className="flex flex-col items-center gap-2 opacity-30 italic">
                  <TrendingUp size={20} />
                  <p className="text-pText font-bold uppercase tracking-widest text-[10px]">
                    No High-Traffic Hardware
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
