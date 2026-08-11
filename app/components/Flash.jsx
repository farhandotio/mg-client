'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, Timer } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';

export default function Flash() {
  const dispatch = useDispatch();
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

  return (
    <section className="py-12 px-4 md:px-6 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 border-b border-border/10 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Zap size={18} className="fill-secondary animate-pulse" />
              <h2 className="text-xl md:text-2xl font-medium text-text tracking-tighter uppercase italic">
                Flash <span className="text-secondary">Deals</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-pText uppercase tracking-wider">
                Time left:
              </span>
              <div className="flex gap-1.5">
                {[timeLeft.hours, timeLeft.mins, timeLeft.secs].map((unit, i) => (
                  <React.Fragment key={i}>
                    <div className="bg-secondary text-black/70 px-2 py-1 rounded font-mono font-medium text-sm min-w-8 text-center shadow-lg shadow-secondary/20">
                      {unit}
                    </div>
                    {i < 2 && <span className="text-secondary font-medium">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/shop?productType=FlashSale"
            className="group flex items-center gap-1.5 text-[13px] md:text-[15px] font-medium text-secondary hover:underline transition-colors max-md:hidden"
          >
            View All Deals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Grid Layout: Mobile 2, Tablet 3, Desktop 5 --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {loading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton type="product" />
              </div>
            ))
          ) : flashSaleProducts.length > 0 ? (
            flashSaleProducts.slice(0, 10).map((product, index) => (
              <div key={product._id} className="w-full">
                <ProductCard product={product} priority={index < 5} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border/10 rounded-md bg-card/20">
              <p className="text-pText opacity-60 text-sm font-medium tracking-tighter uppercase">
                No flash deals available right now
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/shop?productType=FlashSale"
            className="block w-full text-center py-4 bg-secondary/10 border border-secondary/20 rounded-md text-sm font-medium text-secondary active:scale-95 transition-transform"
          >
            View All Flash Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
