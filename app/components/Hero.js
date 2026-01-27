'use client';
import React from 'react';
import { ArrowRight, Star, Globe, Trophy, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] md:min-h-150 bg-bg flex items-center py-10 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-primary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-secondary/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      {/* Static Grid */}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col md:flex-row justify-between w-full gap-12 md:gap-16 items-center">
        {/* --- Left Column --- */}
        <div className="relative z-20 space-y-8 w-full md:w-1/2 opacity-100 transition-opacity duration-500">
          <header className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-black text-text leading-[0.95] tracking-tighter">
              Discover the <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
                  Future
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full opacity-30"
                  viewBox="0 0 300 20"
                  fill="none"
                >
                  <path
                    d="M5 15C50 5 150 5 295 15"
                    stroke="var(--color-primary)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br className="" />
              of Tech.
            </h1>
            <p className="text-pText text-lg md:text-xl max-w-xl leading-relaxed font-medium">
              Premium gadgets verified by experts. Get the latest tech with worldwide shipping and
              2-year secured warranty.
            </p>
          </header>

          <div className="w-full md:w-fit">
            <Button
              arialabel="Explore shop"
              url="/shop"
              size="lg"
              icon={ArrowRight}
              text="Explore Shop"
              className="w-full md:w-fit justify-center"
            />
          </div>

          {/* Indicators */}
          <div className="pt-8 flex flex-row max-md:justify-between gap-6 md:gap-8 items-center border-t border-border/20">
            <div className="flex items-center gap-1">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-[13px] font-bold text-pText uppercase tracking-tight">
                2-Year Warranty
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-secondary" />
              <span className="text-[13px] font-bold text-pText uppercase tracking-tight">
                Global Shipping
              </span>
            </div>
          </div>
        </div>

        {/* --- Right Column --- */}
        <div className="relative flex justify-center md:justify-end items-center w-full max-md:hidden md:w-1/2">
          {/* Static Ring instead of rotating one for lower CPU usage */}
          <div className="absolute w-[105%] aspect-square border border-border/5 rounded-full pointer-events-none" />

          <div className="relative z-10 w-full max-w-85 md:max-w-md aspect-square bg-card border border-border/40 rounded-[2.5rem] md:rounded-[3rem] p-3 shadow-xl group">
            <div className="relative h-full w-full bg-bg rounded-[2.2rem] md:rounded-[2.6rem] overflow-hidden flex items-center justify-center">
              {/* Image with Priority (LCP Fix) */}
              <div className="relative w-4/5 h-4/5 transition-transform duration-500 md:group-hover:scale-105 will-change-transform">
                <Image
                  src="https://imgs.search.brave.com/G1lrzAcX4OiD6m7GZyK955F66uo3VaIkURzpxPS5n8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LmFpcXVpY2tkcmF3/LmNvbS9pbWdjb21w/cmVzc2VkL2ltZy9j/b21wcmVzc2VkXzEw/YmM2NGIwNDRmN2I2/MjhhZTljNzcyZDI3/MzU1YzBlLndlYnA"
                  alt="Watch Pro"
                  fill
                  priority
                  sizes="(max-width: 768px) 300px, 450px"
                  className="object-contain"
                />
              </div>

              {/* Minimal Float Info */}
              <div className="absolute bottom-4 inset-x-4 md:bottom-6 md:inset-x-6 z-20">
                <div className="bg-card/95 backdrop-blur-md border border-border/40 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-primary uppercase">Featured</p>
                    <h3 className="text-text font-bold text-lg  tracking-tighter">
                      Latest Smart Watch Collection
                    </h3>
                  </div>
                  <Link
                    href="/shop?categories=watch"
                    aria-label="Shop Latest Smart Watch"
                    className="bg-primary text-bg p-2.5 rounded-xl transition-transform active:scale-90"
                  >
                    <ArrowRight size={18} strokeWidth={3} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof - Static */}
          <div className="absolute -bottom-2 left-10 z-30 bg-card/90 border border-border/40 p-3 rounded-2xl shadow-lg hidden md:flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative w-7 h-7 rounded-full border border-card overflow-hidden"
                >
                  <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User" fill />
                </div>
              ))}
            </div>
            <p className="text-[9px] font-black text-pText uppercase tracking-tighter">
              50k+ Geeks
              {/* Background Glows - Fixed & Static for performance */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
