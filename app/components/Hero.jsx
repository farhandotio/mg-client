'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, ShieldCheck, Zap, CheckCircle2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import Image from 'next/image';

const SLIDE_DATA = [
  {
    id: 1,
    img: 'https://imgs.search.brave.com/tu2vBQIG3PFiq_7QOidoJ3FHSLbpiHRxdBesu-LYW0A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvbW9k/ZXJuLXNtYXJ0d2F0/Y2gtYmxhY2stYmFu/ZC1uNnNsY280cW54/MWFlczhtLnBuZw',
    title: 'স্মার্ট ওয়াচ প্রো',
    tag: 'বেস্ট সেলার',
  },
  {
    id: 2,
    img: 'https://imgs.search.brave.com/LhDDwEPdW5a6NHbSV8GHKq6OlKt0sMRL6WQ7v3jKRuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjMvRWFy/YnVkcy1QTkctSXNv/bGF0ZWQtRmlsZS5w/bmc',
    title: 'প্রিমিয়াম ইয়ারবাডস',
    tag: 'নতুন কালেকশন',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDE_DATA.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-145 bg-bg flex items-center py-10 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* --- বাম পাশ: কন্টেন্ট --- */}
        <div className="space-y-8 z-10">
          <header className="space-y-6">
            <h1 className="text-[40px] md:text-6xl font-black text-text tracking-tighter leading-none">
              প্রযুক্তির আসল স্বাদ, <br />
              <span className="text-transparent text-[52px] md:text-7xl bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
                এখন আপনার হাতের মুঠোয়।
              </span>
            </h1>
            <p className="text-pText text-lg md:text-xl max-w-xl leading-relaxed font-medium italic">
              "গ্যাজেট বিডিএস-এ আমরা দিচ্ছি ১০০% অরিজিনাল ব্র্যান্ডের নিশ্চয়তা। সরাসরি ইমপোর্ট করা
              পণ্য এখন আপনার দোরগোড়ায়।"
            </p>
          </header>

          <div>
            <Button
              arialabel="কালেকশন দেখুন"
              url="/shop"
              size="lg"
              icon={ArrowRight}
              text="কালেকশন দেখুন"
              className="w-full sm:w-fit"
            />
          </div>

          {/* ট্রাস্ট ইন্ডিকেটরস */}
          <div className="pt-8 flex flex-wrap gap-8 border-t border-border/20">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-secondary" />
              <div className="flex flex-col">
                <span className="text-base font-black text-text uppercase">দ্রুত ডেলিভারি</span>
                <span className="text-sm text-pText font-bold uppercase tracking-tighter">
                  সারা বাংলাদেশে
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 max-md:hidden">
              <Globe size={20} className="text-primary" />
              <div className="flex flex-col">
                <span className="text-base font-black text-text uppercase">সহজ রিটার্ন</span>
                <span className="text-sm text-pText font-bold uppercase tracking-tighter">
                  সাত দিনের পলিসি
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Activity size={20} className="text-success" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-text uppercase">অরিজিনাল পণ্য</span>
                <span className="text-sm text-pText font-bold uppercase tracking-tighter">
                  ১০০% গ্যারান্টি
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- ডান পাশ: স্লাইডার (শুধুমাত্র ডেস্কটপে দৃশ্যমান) --- */}
        <div className="hidden lg:flex relative w-full h-125 items-center justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-120 h-full flex items-center justify-center"
            >
              {/* Product Badge */}
              <div className="absolute top-10 left-10 z-20">
                <span className="bg-text text-bg text-[12px] font-black px-3 py-1 rounded uppercase">
                  {SLIDE_DATA[currentSlide].tag}
                </span>
              </div>

              {/* Minimal Image Showcase */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={SLIDE_DATA[currentSlide].img}
                  alt={SLIDE_DATA[currentSlide].title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
                />
              </div>

              {/* Slider Progress Indicator */}
              <div className="absolute bottom-4 right-0 flex gap-2">
                {SLIDE_DATA.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 bg-primary' : 'w-4 bg-border/40'}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Verification Badge */}
          <div className="absolute bottom-10 left-0 bg-card border border-border/50 p-4 rounded-md shadow-2xl z-30 flex items-center gap-3">
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-[12px] font-black text-pText uppercase">অরিজিনাল</p>
              <p className="text-sm font-black text-text tracking-tight">গ্যারান্টিড প্রোডাক্ট</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
