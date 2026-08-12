'use client';
import React, { useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import Link from 'next/link';
import Image from 'next/image';

export default function Feature() {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts('limit=10&productType=Featured&sort=-createdAt'));
  }, [dispatch]);

  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="">
        <div className="flex justify-between items-end mb-8 gap-4 border-b border-border/10 pb-4">
          <div className="flex items-start justify-between gap-6 w-full h-fit">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-text leading-[1.1] max-w-2xl">
              Designed for seamless sound and advanced technology.
            </h2>
            <div className="relative shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-0 overflow-hidden">
              <Image
                src="/images/Audio_gadgets_commercial_product…_202608111342.jpeg"
                alt="Featured Lifestyle"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- Grid Area: Mobile 2 columns, Desktop 5 columns --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="col-span-full py-16 text-center border-2 border-dashed border-border/10 rounded-0">
              <p className="text-pText opacity-60 text-sm font-medium tracking-tighter uppercase">
                No products found currently
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/shop?productType=Featured"
            className="w-full text-center py-3 bg-card border border-border/60 rounded-0 text-sm font-medium text-text active:scale-95 transition-transform md:w-fit px-5"
          >
            View All Products
            <ArrowRight size={16} className="inline-block ml-1 -rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
}
