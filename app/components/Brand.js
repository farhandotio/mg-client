'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '@/store/features/brandSlice';
import Image from 'next/image';

export default function Brand() {
  const dispatch = useDispatch();
  const { brands, isLoading } = useSelector((state) => state.brands);

  // আপনার JSON অনুযায়ী ডেটা যদি সরাসরি অ্যারে না হয়, তবে এই লজিকটি সেফ রাখবে
  const brandsData = Array.isArray(brands) ? brands : brands?.brands || [];

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="py-20 bg-bg flex justify-center items-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-bg border-y border-border/30 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-4 bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
            Official Partners
          </span>
          <h2 className="text-pText/60 text-sm font-medium">World-class tech at your fingertips</h2>
        </div>

        {/* Brands Container */}
        <div className="flex flex-wrap md:gap-y-12 gap-10 md:gap-x-30 items-center justify-center">
          {brandsData.length > 0 ? (
            brandsData.map((brand) => (
              <div
                key={brand._id}
                className="group relative w-fit flex flex-col items-center justify-center transition-all duration-500"
              >
                {/* Logo Wrapper */}
                <div className="relative w-28 h-12 md:w-36 md:h-16 flex items-center justify-center">
                  <Image
                    src={brand.image?.url}
                    alt={brand.name}
                    fill
                    className="object-cover filter grayscale brightness-125 contrast-75 opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700 ease-out rounded-2xl"
                  />
                </div>

                {/* Glassmorphism Label on Hover */}
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 group-hover:-bottom-6 transition-all duration-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {brand.name}
                  </span>
                </div>

                {/* Subtle Glow Behind Logo */}
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10">
              <p className="text-pText/30 text-[10px] uppercase tracking-widest italic">
                No active brands found
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
