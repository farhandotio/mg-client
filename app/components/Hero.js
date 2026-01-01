'use client';
import React from 'react';
import { ArrowRight, Star, Zap, ShieldCheck, Globe } from 'lucide-react';
import Button from '@/components/Button';

export default function Hero() {
  return (
    <section className="relative w-full min-h-190 bg-bg flex items-center justify-center py-12 md:pt-0 px-6 lg:px-12 overflow-hidden">
      {/* --- Ambient Background Elements --- */}
      {/* বড় গ্লোয়িং সার্কেল */}
      <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-[#00A3FF]/10 blur-[120px] rounded-full -z-10"></div>

      {/* Abstract Grid Pattern (Optional) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-linear(var(--color-text) 1px, transparent 1px)`,
          size: '40px 40px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* --- Left Column: Content --- */}
        <div className="relative z-20 space-y-10">
          {/* Top Badge: Floating Style */}
          <div className="inline-flex items-center gap-3 bg-card/40 backdrop-blur-xl border border-border/50 px-5 py-2.5 rounded-2xl shadow-xl animate-bounce-slow">
            <div className="bg-primary/20 p-1.5 rounded-lg">
              <Zap size={18} className="text-primary fill-primary" />
            </div>
            <span className="text-text text-sm font-bold tracking-tight">
              New Year Sale <span className="text-primary">— Up to 40% Off</span>
            </span>
          </div>

          {/* Main Typography: High Contrast */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-text leading-[0.95] tracking-tighter">
              Discover the <br />
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-primary via-[#00D1FF] to-primary">
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
              <br />
              of Tech.
            </h1>
            <p className="text-pText text-xl max-w-130 leading-relaxed font-medium">
              Elevate your lifestyle with premium gadgets and next-gen electronics. Experience tech
              like never before.
            </p>
          </div>

          {/* Buttons: 3D Glossy Style */}
          <div className="flex max-md:flex-col gap-6 items-center">
            <Button size="xl" icon={ArrowRight} text={'Shop Now'} className="rounded-2xl" />

            <Button
              size="xl"
              bgColor="bg-bg"
              icon={ArrowRight}
              text={'View Deals'}
              className="rounded-2xl"
            />
          </div>

          {/* Trust Indicators */}
          <div className="pt-10 flex flex-wrap gap-10 items-center opacity-80">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" />
              <span className="text-sm font-bold text-pText uppercase tracking-widest">
                2 Year Warranty
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="text-[#00A3FF]" />
              <span className="text-sm font-bold text-pText uppercase tracking-widest">
                Global Shipping
              </span>
            </div>
          </div>
        </div>

        {/* --- Right Column: Visual Mockup --- */}
        <div className="relative group flex justify-center items-center">
          {/* Animated Background Rings */}
          <div className="absolute w-[120%] aspect-square border-0.5 border-border/20 rounded-full scale-75 lg:scale-100"></div>
          <div className="absolute w-[90%] aspect-square border-0.5 border-primary/10 rounded-full animate-ping-slow"></div>

          {/* Main Showcase Card */}
          <div className="relative z-10 w-full max-w-125 aspect-4/5 bg-linear-to-br from-card to-bg border border-border/50 rounded-[4rem] p-4 shadow-2xl backdrop-blur-3xl overflow-hidden group-hover:border-primary/30 transition-colors duration-500">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-30 group-hover:rotate-12 transition-transform duration-1000"></div>

            {/* Inner "Device" Screen */}
            <div className="relative h-full w-full bg-[#080808] rounded-[3.2rem] overflow-hidden border-[6px] border-text/5 flex flex-col items-center justify-center shadow-inner">
              {/* Floating Badges inside Screen */}
              <div className="absolute top-10 left-6 bg-primary px-3 py-1 rounded-full text-[10px] font-black text-bg z-20 shadow-lg animate-pulse">
                HOT DEAL
              </div>

              <img
                src="https://imgs.search.brave.com/G1lrzAcX4OiD6m7GZyK955F66uo3VaIkURzpxPS5n8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LmFpcXVpY2tkcmF3/LmNvbS9pbWdjb21w/cmVzc2VkL2ltZy9j/b21wcmVzc2VkXzEw/YmM2NGIwNDRmN2I2/MjhhZTljNzcyZDI3/MzU1YzBlLndlYnA"
                alt="Featured Product"
                className="w-[85%] h-auto object-contain z-10 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3 drop-shadow-[0_35px_60px_rgba(0,0,0,0.8)]"
              />

              {/* Product Info Overlay inside Screen */}
              <div className="absolute bottom-8 left-0 right-0 px-8 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-4 rounded-2xl flex justify-between items-center shadow-2xl">
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase">Iphone 15 Pro</p>
                    <p className="text-text font-black text-lg">$999.00</p>
                  </div>
                  <button className="bg-primary text-bg p-2.5 rounded-xl shadow-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Floating Element: Rating Card */}
          <div className="absolute -bottom-6 -left-10 z-30 bg-card/60 backdrop-blur-2xl border border-border p-5 rounded-3xl shadow-2xl hidden md:block animate-float">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-card bg-secondary/20 overflow-hidden"
                  >
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-primary">
                  <Star size={14} className="fill-primary" />
                  <Star size={14} className="fill-primary" />
                  <Star size={14} className="fill-primary" />
                  <Star size={14} className="fill-primary" />
                  <Star size={14} className="fill-primary" />
                </div>
                <p className="text-[10px] font-bold text-pText mt-1">50K+ ACTIVE USERS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
