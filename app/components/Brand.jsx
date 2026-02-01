'use client';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '@/store/features/brandSlice';
import Image from 'next/image';
import Skeleton from '@/components/Skeleton';
import { ShieldCheck } from 'lucide-react';

export default function Brand() {
  const dispatch = useDispatch();
  const { brands, isLoading } = useSelector((state) => state.brands);

  // ব্রান্ড ডেটা মেমোরাইজ করা হয়েছে পারফরম্যান্সের জন্য
  const brandsData = useMemo(() => {
    return Array.isArray(brands) ? brands : brands?.brands || [];
  }, [brands]);

  useEffect(() => {
    if (brandsData.length === 0) dispatch(fetchBrands());
  }, [dispatch, brandsData.length]);

  return (
    <section className="py-16 bg-bg relative overflow-hidden border-t border-border/10">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_20%,rgba(var(--primary-rgb),0.03),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={18} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                অফিসিয়াল পার্টনারস
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-text tracking-tighter uppercase italic leading-none">
              সেরা সব <span className="text-primary">ব্র্যান্ড</span>
            </h2>
            <p className="text-pText font-bold text-sm max-w-sm opacity-80">
              বিশ্বখ্যাত প্রযুক্তি ব্র্যান্ডের অরিজিনাল গ্যাজেট এখন একই ছাদের নিচে।
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-pText/40 font-bold text-[11px] uppercase tracking-widest">
            <span>কানেক্টেড ব্র্যান্ডস</span>
            <div className="w-12 h-0.5 bg-border/30" />
            <span className="text-primary">{brandsData.length} টি ইউনিট</span>
          </div>
        </div>

        {/* --- Optimized Infinite Marquee --- */}
        <div className="relative w-full overflow-hidden py-4 mask-fade-edges">
          <div className="flex w-max animate-marquee hover:pause gap-8 items-center">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="w-48 h-24 bg-card/20 rounded-2xl animate-pulse" />
              ))
            ) : brandsData.length > 0 ? (
              // অ্যানিমেশন স্মুথ রাখার জন্য ডাবল ডেটা ব্যবহার
              [...brandsData, ...brandsData].map((brand, idx) => (
                <div
                  key={`${brand._id}-${idx}`}
                  className="group relative w-40 h-24 md:w-56 md:h-32 flex items-center justify-center"
                >
                  {/* Card Base */}
                  <div className="absolute inset-0 bg-card/30 backdrop-blur-sm border border-border/40 rounded-2xl transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/60 group-hover:shadow-2xl group-hover:shadow-primary/5" />

                  {/* Brand Logo Container */}
                  <div className="relative w-[70%] h-[60%] transition-all duration-500 group-hover:scale-110">
                    <Image
                      src={brand?.image?.url || '/placeholder.png'}
                      alt={brand?.name}
                      fill
                      sizes="200px"
                      className="object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      quality={75} // লোগোর জন্য কম কোয়ালিটি যথেষ্ট, পারফরম্যান্স বাড়বে
                    />
                  </div>

                  {/* Minimal Brand Label */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-[9px] font-black text-bg bg-primary px-3 py-1 rounded-full uppercase">
                      {brand.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-pText/20 italic font-black uppercase py-10">
                কোনো ব্র্যান্ড পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
