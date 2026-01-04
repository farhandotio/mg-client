'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '@/store/features/brandSlice';
import Image from 'next/image';
import Skeleton from '@/components/Skeleton';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Brand() {
  const dispatch = useDispatch();
  const { brands, isLoading } = useSelector((state) => state.brands);

  const brandsData = Array.isArray(brands) ? brands : brands?.brands || [];

  useEffect(() => {
    if (brandsData.length === 0) dispatch(fetchBrands());
  }, [dispatch, brandsData.length]);

  return (
    <section className="py-24 bg-bg relative overflow-hidden border-t border-border/10">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_20%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- Header Section: Aligned Left like others --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Protocol: Strategic Link
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Global <span className="text-primary">Allies</span>
            </h2>
            <p className="text-pText font-medium max-w-sm">
              Official nodes from the world's most elite hardware manufacturers.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-pText/30 font-mono text-[10px] uppercase tracking-widest">
            <span>Systems_Connected</span>
            <div className="w-12 h-0.5 bg-border/50" />
            <span className="text-primary">{brandsData.length} Units</span>
          </div>
        </div>

        {/* --- Unique Skewed Marquee Wrapper --- */}
        <div className="relative w-full overflow-hidden mask-fade-edges py-10">
          <div className="flex w-max animate-marquee pause-on-hover gap-6 items-center">
            {isLoading ? (
              <Skeleton type="brand" count={10} className="w-48 h-28 rounded-2xl" />
            ) : brandsData.length > 0 ? (
              [...brandsData, ...brandsData].map((brand, idx) => (
                <div
                  key={`${brand._id}-${idx}`}
                  className="group relative w-44 h-28 md:w-60 md:h-36 transition-all duration-500"
                >
                  {/* The Unique Slanted Card Shape */}
                  <div className="absolute inset-0 bg-card/40 backdrop-blur-sm border border-border/40 clip-path-cyber rounded-xl transition-all duration-500 group-hover:border-primary/50 group-hover:bg-card/80 group-hover:-translate-y-2 shadow-xl" />

                  {/* Brand Image - Cover Mode */}
                  <div className="absolute inset-2 overflow-hidden rounded-lg clip-path-cyber-inner">
                    <Image
                      src={brand.image?.url}
                      alt={brand.name}
                      fill
                      className="object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                    />

                    {/* Overlay Label */}
                    <div className="absolute bottom-2 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[9px] font-black text-bg bg-primary px-2 py-0.5 rounded uppercase tracking-tighter">
                        {brand.name}
                      </span>
                    </div>
                  </div>

                  {/* Aesthetic Glitch Lines */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary/0 group-hover:border-primary transition-all duration-500" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary/0 group-hover:border-primary transition-all duration-500" />
                </div>
              ))
            ) : (
              <div className="w-full text-center opacity-20 italic uppercase font-black tracking-widest">
                No active signals found
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .clip-path-cyber {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
        .clip-path-cyber-inner {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
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
          animation: marquee 45s linear infinite;
        }
        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
