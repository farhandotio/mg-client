'use client';
import React, { useEffect } from 'react';
import { ArrowRight, Flame, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';

export default function Best() {
  const dispatch = useDispatch();
  const { bestSellerProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts('limit=10&productType=BestSeller&sort=-sold'));
  }, [dispatch]);

  return (
    <section className="py-12 px-4 md:px-6 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 gap-4 border-b border-border/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-primary">
              <TrendingUp size={16} className="animate-bounce" />
              <span className="text-[12px] md:text-[11px] font-black uppercase tracking-wider">
                সবচেয়ে জনপ্রিয়
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-text tracking-tighter leading-none">
              সেরা <span className="text-primary">বিক্রিত পণ্য</span>
            </h2>
          </div>

          <Link
            href="/shop?productType=BestSeller"
            className="group flex items-center gap-1.5 text-[12px] md:text-[14px] font-bold text-primary hover:underline transition-colors max-md:hidden"
          >
            র‍্যাঙ্কিং লিস্ট
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
          ) : bestSellerProducts && bestSellerProducts.length > 0 ? (
            bestSellerProducts.slice(0, 10).map((product, index) => (
              <div key={product._id} className="w-full">
                <ProductCard product={product} priority={index < 5} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border/10 rounded-md bg-card/10">
              <div className="flex flex-col items-center gap-2 opacity-40">
                <TrendingUp size={24} />
                <p className="text-pText font-bold uppercase tracking-tighter text-[11px]">
                  বর্তমানে কোনো তথ্য নেই
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/shop?productType=BestSeller"
            className="block w-full text-center py-4 bg-card border border-border/60 rounded-md text-sm font-black text-text active:scale-95 transition-transform"
          >
            সবগুলো জনপ্রিয় পণ্য দেখুন
          </Link>
        </div>
      </div>
    </section>
  );
}
