'use client';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '@/store/features/brandSlice';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export default function Brand() {
  const dispatch = useDispatch();
  const { brands, isLoading } = useSelector((state) => state.brands);

  const brandsData = useMemo(() => {
    return Array.isArray(brands) ? brands : brands?.brands || [];
  }, [brands]);

  useEffect(() => {
    if (brandsData.length === 0) dispatch(fetchBrands());
  }, [dispatch, brandsData.length]);

  return (
    <section
      className="py-16 bg-bg relative overflow-hidden border-t border-border/10"
      aria-labelledby="brand-heading"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_20%,rgba(var(--primary-rgb),0.05),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={18} className="animate-pulse" aria-hidden="true" />
              <span className="text-[12px] font-medium uppercase tracking-wider">
                Official Partners
              </span>
            </div>
            <h2
              id="brand-heading"
              className="text-2xl md:text-3xl font-medium text-text tracking-tighterer uppercase italic leading-none"
            >
              Top <span className="text-primary">Brands</span>
            </h2>
            <p className="text-pText font-medium text-sm max-w-sm">
              Original gadgets from world-class tech brands are now under one roof.
            </p>
          </div>

          {/* Accessibility Fix: Increased contrast from /40 to /70 */}
          <div className="hidden md:flex items-center gap-2 text-pText/70 font-medium text-[11px] uppercase tracking-tighter">
            <span>Connected Brands</span>
            <div className="w-12 h-0.5 bg-border/50" />
            <span className="text-primary">{brandsData.length} units</span>
          </div>
        </div>

        {/* --- Optimized Infinite Marquee --- */}
        <div
          className="relative w-full overflow-hidden py-4 mask-fade-edges"
          role="region"
          aria-label="Brand showcase marquee"
        >
          <div className="flex w-max animate-marquee hover:pause gap-8 items-center">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="w-40 h-24 md:w-56 md:h-32 bg-card/20 rounded-md animate-pulse"
                />
              ))
            ) : brandsData.length > 0 ? (
              [...brandsData, ...brandsData].map((brand, idx) => (
                <div
                  key={`${brand._id}-${idx}`}
                  className="group relative w-40 h-24 md:w-56 md:h-32 flex items-center justify-center shrink-0"
                >
                  {/* Card Base */}
                  <div className="absolute inset-0 bg-card/30 backdrop-blur-sm border border-border/40 rounded-md transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card/60" />

                  {/* Brand Logo Container */}
                  <div className="relative w-[65%] h-[55%] transition-all duration-500 group-hover:scale-110">
                    <Image
                      src={brand?.image?.url || '/placeholder.png'}
                      alt={`${brand?.name} logo`}
                      fill
                      sizes="(max-width: 768px) 160px, 224px"
                      className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                      quality={60} // enough quality for logos, loads fast
                      loading="lazy"
                    />
                  </div>

                  {/* Minimal Brand Label */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <span className="text-[10px] font-medium text-white bg-primary px-3 py-1 rounded-full uppercase whitespace-nowrap shadow-lg">
                      {brand.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-pText/50 italic font-medium uppercase py-10">
                No brands found
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
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
          display: flex;
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
        .hover\:pause:hover {
          animation-play-state: paused;
        }
        /* Increase animation speed slightly on mobile so users don't get bored */
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 30s;
          }
        }
      `}</style>
    </section>
  );
}
