'use client';
import React from 'react';
import { ArrowRight, Star, Zap, ShieldCheck, Globe, Trophy } from 'lucide-react';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-150 bg-bg flex items-center py-10 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-secondary/10 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-linear(var(--color-border) 1px, transparent 1px)`,
          size: '30px 30px',
          backgroundSize: '30px 30px',
        }}
      ></div>

      <div className="flex justify-between w-full max-md:flex-wrap gap-16 items-center">
        {/* --- Left Column: Content --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 space-y-8"
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 bg-card backdrop-blur-md border border-border/50 px-4 py-2 rounded-2xl shadow-sm">
            <Trophy size={16} className="text-primary" />
            <span className="text-text text-[11px] font-black uppercase tracking-widest">
              N°1 Tech Store in 2026
            </span>
          </div>

          {/* Main Typography */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-black text-text leading-[0.95] tracking-tighter">
              Discover the <br />
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
                  Future
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                  <path
                    d="M5 15C50 5 150 5 295 15"
                    stroke="var(--color-primary)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </span>{' '}
              <br className="md:hidden" />
              of Tech.
            </h1>
            <p className="text-pText text-lg md:text-xl max-w-xl leading-relaxed font-medium">
              Premium gadgets verified by experts. Get the latest tech with worldwide shipping and
              2-year secured warranty.
            </p>
          </div>

          {/* Functional Buttons */}
          <div className="md:w-fit">
            <Button url="/shop" size="lg" icon={ArrowRight} text="Explore Shop" className="w-fit" />
          </div>

          {/* Trust Indicators */}
          <div className="pt-10 flex flex-wrap gap-8 items-center border-t border-border/30">
            <div className="flex items-center gap-3 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ShieldCheck size={20} className="text-primary" />
              </div>
              <span className="text-[10px] font-black text-pText uppercase tracking-widest">
                2-Year Warranty
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                <Globe size={20} className="text-secondary" />
              </div>
              <span className="text-[10px] font-black text-pText uppercase tracking-widest">
                Global Shipping
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- Right Column: Visual Showcase --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center items-center"
        >
          {/* Decorative Circles */}
          <div className="absolute w-[110%] aspect-square border border-border/10 rounded-full animate-[spin_20s_linear_infinite]"></div>

          {/* Main Visual Card */}
          <div className="relative z-10 w-full max-w-md aspect-square bg-card border border-border/50 rounded-[3rem] p-3 shadow-2xl overflow-hidden group">
            {/* Inner "Screen" */}
            <div className="relative h-full w-full bg-[#0c0c0c] rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center border border-white/5">
              {/* Status Badge */}
              <div className="absolute top-8 right-8 z-20 bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-primary uppercase">In Stock</span>
              </div>

              {/* Product Image with Subtle Hover Float */}
              <img
                src="https://imgs.search.brave.com/G1lrzAcX4OiD6m7GZyK955F66uo3VaIkURzpxPS5n8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LmFpcXVpY2tkcmF3/LmNvbS9pbWdjb21w/cmVzc2VkL2ltZy9j/b21wcmVzc2VkXzEw/YmM2NGIwNDRmN2I2/MjhhZTljNzcyZDI3/MzU1YzBlLndlYnA"
                alt="Iphone 15 Pro"
                className="w-[80%] h-auto object-contain z-10 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />

              {/* Product Info - Permanent Visibility for Trust */}
              <div className="absolute bottom-6 inset-x-6 z-20">
                <div className="bg-card/90 backdrop-blur-xl border border-border/50 p-5 rounded-3xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-tighter">
                      Featured Hardware
                    </p>
                    <h3 className="text-text font-black text-xl italic tracking-tighter">
                      IPHONE 15 PRO
                    </h3>
                  </div>
                  <Link
                    href="/shop/iphone-15-pro"
                    className="bg-primary text-bg p-3 rounded-2xl hover:scale-105 transition-transform"
                  >
                    <ArrowRight size={20} strokeWidth={3} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Floating Card */}
          <div className="absolute -bottom-4 -left-6 z-30 bg-card/80 backdrop-blur-2xl border border-border/50 p-4 rounded-2xl shadow-2xl hidden md:block">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    className="w-8 h-8 rounded-full border-2 border-card"
                    alt="User"
                  />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-current" />
                  ))}
                </div>
                <p className="text-[9px] font-black text-pText uppercase mt-0.5 tracking-tighter">
                  Loved by 50k+ Geeks
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
