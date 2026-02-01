'use client';
import React, { useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';

export default function Feature() {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts('limit=10&productType=Featured&sort=-createdAt'));
  }, [dispatch]);

  return (
    <section className="py-12 px-4 md:px-6 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 gap-4 border-b border-border/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-secondary">
              <Flame size={16} className="fill-secondary animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider">
                বেস্ট কালেকশন
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-text tracking-tight leading-none">
              আপনার জন্য <span className="text-primary">বাছাইকৃত</span>
            </h2>
          </div>

          <Link
            href="/shop?productType=Featured"
            className="group flex items-center gap-1 text-[12px] md:text-[14px] font-bold text-primary hover:underline transition-colors"
          >
            সবগুলো দেখুন
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- Grid Area: Mobile 2 columns, Desktop 5 columns --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {loading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton type="product" />
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.slice(0, 10).map((product, index) => (
              <div key={product._id} className="w-full">
                <ProductCard product={product} priority={index < 5} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border/10 rounded-3xl">
              <p className="text-pText opacity-60 text-sm font-bold tracking-widest uppercase">
                বর্তমানে কোনো পণ্য পাওয়া যায়নি
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/shop?productType=Featured"
            className="w-full text-center py-3 bg-card border border-border/60 rounded-xl text-sm font-bold text-text active:scale-95 transition-transform"
          >
            সবগুলো পণ্য দেখুন
          </Link>
        </div>
      </div>
    </section>
  );
}
