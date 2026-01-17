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
  const { flashSaleProducts, loading } = useSelector((state) => state.products);
  const [timeLeft, setTimeLeft] = useState({ hours: '00', mins: '00', secs: '00' });

  useEffect(() => {
    dispatch(fetchAllProducts('limit=10&productType=FlashSale&sort=-createdAt'));
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
      const scrollAmount = scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-10 px-4 md:px-6 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-secondary">
                <Zap size={14} className="animate-pulse fill-secondary" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                  Limited Protocol
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-lg border border-secondary/20">
                <Timer size={12} />
                <span>
                  {timeLeft.hours}:{timeLeft.mins}:{timeLeft.secs}
                </span>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Flash <span className="text-secondary">Deals</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-secondary/50 transition-all active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-secondary/50 transition-all active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Link
              href="/shop?productType=FlashSale"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pText hover:text-secondary"
            >
              All Deals{' '}
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
            ) : flashSaleProducts.length > 0 ? (
              flashSaleProducts.map((product) => (
                <div
                  key={product._id}
                  className="min-w-[65%] sm:min-w-[35%] md:min-w-[28%] lg:min-w-[19%] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="w-full py-16 text-center border border-dashed border-border/10 rounded-2xl">
                <p className="text-pText opacity-40 text-xs italic uppercase font-bold tracking-widest">
                  No Active Flash Signals
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
