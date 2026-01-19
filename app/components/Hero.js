'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Globe, Trophy, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const contentVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.8,
        ease: 'easeOut',
      },
    },
  };

  const visualVariants = {
    hidden: {
      opacity: 0,
      scale: isMobile ? 1 : 0.9, 
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: isMobile ? 0.5 : 1 },
    },
  };

  return (
    <section className="relative w-full min-h-screen md:min-h-150 bg-bg flex items-center py-10 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 md:w-125 md:h-125 bg-primary/10 blur-[60px] md:blur-[120px] rounded-full -z-10 pointer-events-none select-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 md:w-100 md:h-100 bg-secondary/10 blur-[60px] md:blur-[100px] rounded-full -z-10 pointer-events-none select-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] md:opacity-[0.15] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row justify-between w-full gap-12 md:gap-16 items-center">
        {/* --- Left Column: Content --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: isMobile ? '0px' : '-50px' }}
          variants={contentVariants}
          className="relative z-20 space-y-6 md:space-y-8 w-full md:w-1/2 text-left flex flex-col md:items-start"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 bg-card backdrop-blur-md border border-border/50 px-4 py-2 rounded-2xl shadow-sm w-fit">
            <Trophy className="text-primary w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
            <span className="text-text text-[10px] md:text-[11px] font-black uppercase tracking-widest">
              N°1 Tech Store in 2026
            </span>
          </div>

          <header className="space-y-4 md:space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-text leading-[0.95] tracking-tighter">
              Discover the <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
                  Future
                </span>
                <svg
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                  viewBox="0 0 300 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 15C50 5 150 5 295 15"
                    stroke="var(--color-primary)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </span>{' '}
              <br className="hidden md:block" />
              of Tech.
            </h1>
            <p className="text-pText text-base md:text-xl max-w-md md:max-w-xl leading-relaxed font-medium">
              Premium gadgets verified by experts. Get the latest tech with worldwide shipping.
            </p>
          </header>

          <div className="w-full md:w-fit flex justify-center md:justify-start">
            <Button
              arialabel="Explore shop"
              url="/shop"
              size="lg"
              icon={ArrowRight}
              text="Explore Shop"
              className="w-full md:w-fit justify-center"
            />
          </div>

          <div className="pt-6 md:pt-10 flex flex-row gap-6 md:gap-8 items-center border-t border-border/30 w-full justify-center md:justify-start">
            <div className="flex items-center gap-2 group">
              <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="text-primary w-4.5 h-4.5 md:w-5 md:h-5" />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-pText uppercase tracking-widest">
                2-Year Warranty
              </span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="p-1.5 md:p-2 bg-secondary/10 rounded-lg">
                <Globe className="text-secondary w-4.5 h-4.5 md:w-5 md:h-5" />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-pText uppercase tracking-widest">
                Global Shipping
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- Right Column: Visual --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={visualVariants}
          className="relative flex justify-center md:justify-end items-center w-full md:w-1/2"
        >
          <div className="absolute w-[90%] md:w-[110%] aspect-square border border-border/10 rounded-full animate-[spin_50s_linear_infinite] md:animate-[spin_30s_linear_infinite] will-change-transform pointer-events-none" />

          <div className="relative z-10 w-full max-w-[320px] md:max-w-md aspect-square bg-card border border-border/50 rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl overflow-hidden group">
            <div className="relative h-full w-full bg-bg rounded-[2.2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center border border-white/5">
              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 bg-primary/10 backdrop-blur-md border border-primary/20 px-2 md:px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full md:animate-ping" />
                <span className="text-[8px] md:text-[10px] font-black text-primary uppercase">
                  In Stock
                </span>
              </div>

              <div className="relative w-full h-full flex items-center justify-center p-8 md:p-12">
                <Image
                  src="https://imgs.search.brave.com/G1lrzAcX4OiD6m7GZyK955F66uo3VaIkURzpxPS5n8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LmFpcXVpY2tkcmF3/LmNvbS9pbWdjb21w/cmVzc2VkL2ltZy9j/b21wcmVzc2VkXzEw/YmM2NGIwNDRmN2I2/MjhhZTljNzcyZDI3/MzU1YzBlLndlYnA"
                  alt="Product"
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, 470px"
                  className="object-contain transition-transform duration-700 md:group-hover:scale-110 md:group-hover:-translate-y-6 will-change-transform"
                />
              </div>

              <div className="absolute bottom-4 inset-x-4 md:bottom-6 md:inset-x-6 z-20">
                <div className="bg-card/90 backdrop-blur-xl border border-border/50 p-4 md:p-5 rounded-2xl md:rounded-3xl flex justify-between items-center shadow-lg">
                  <div className="truncate">
                    <p className="text-[8px] md:text-[10px] font-black text-primary uppercase">
                      Featured
                    </p>
                    <h3 className="text-text font-black text-lg md:text-xl italic tracking-tighter truncate">
                      Apple Watch Pro
                    </h3>
                  </div>
                  <Link
                    href="/shop"
                    className="bg-primary text-bg p-2 md:p-3 rounded-xl transition-all active:scale-95 shrink-0"
                  >
                    <ArrowRight className="w-4.5 h-4.5 md:w-5 md:h-5" strokeWidth={3} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-2 md:-left-6 z-30 bg-card/80 backdrop-blur-2xl border border-border/50 p-3 md:p-4 rounded-2xl shadow-2xl flex md:block">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex -space-x-2 md:-space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-card overflow-hidden"
                  >
                    <Image
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="shrink-0">
                <div className="flex gap-0.5 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 md:w-2.5 md:h-2.5 fill-current" />
                  ))}
                </div>
                <p className="text-[7px] md:text-[9px] font-black text-pText uppercase tracking-tighter">
                  50k+ Geeks
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
