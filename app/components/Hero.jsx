'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Zap, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/Button';
import Image from 'next/image';

const SLIDE_DATA = [
  {
    id: 1,
    img: 'https://imgs.search.brave.com/tu2vBQIG3PFiq_7QOidoJ3FHSLbpiHRxdBesu-LYW0A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvbW9k/ZXJuLXNtYXJ0d2F0/Y2gtYmxhY2stYmFu/ZC1uNnNsY280cW54/MWFlczhtLnBuZw',
    title: 'স্মার্ট ওয়াচ আল্ট্রা প্রো',
    tag: 'বেস্ট সেলার',
  },
  {
    id: 2,
    img: 'https://imgs.search.brave.com/LhDDwEPdW5a6NHbSV8GHKq6OlKt0sMRL6WQ7v3jKRuw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjMvRWFy/YnVkcy1QTkctSXNv/bGF0ZWQtRmlsZS5w/bmc',
    title: 'প্রিমিয়াম নয়েজ ক্যানসেলিং ইয়ারবাডস',
    tag: 'নতুন কালেকশন',
  },
  {
    id: 3,
    img: 'https://imgs.search.brave.com/9W0Dpmla0NivVmMjLUy-uOjMBBYpstnwGzWvQgKfPOw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjQv/ODQxLzI4MC9zbWFs/bC93aXJlbGVzcy1o/ZWFkcGhvbmUtaXNv/bGF0ZWQtb24tdHJh/bnNwYXJlbnQtYmFj/a2dyb3VuZC1oaWdo/LXF1YWxpdHktYmx1/ZXRvb3RoLWhlYWRw/aG9uZS1mb3ItYWR2/ZXJ0aXNpbmctYW5k/LXByb2R1Y3QtY2F0/YWxvZ3MtZ2VuZXJh/dGl2ZS1haS1wbmcu/cG5n',
    title: 'প্রফেশনাল গেমিং হেডফোন',
    tag: 'ট্রেন্ডিং এখন',
  },
  {
    id: 4,
    img: 'https://imgs.search.brave.com/g1GNmjcHxGYSsBqQpsjgN6yNpwN8qiO8I0SLQRBT2jM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmx1/ZXRvb3RoLXNwZWFr/ZXItZm9yLWNhci1w/bmctMzctaXQxYWY2/eGthZGwyMzl3aC5w/bmc',
    title: 'পোর্টেবল ব্লুটুথ স্পিকার',
    tag: 'লিমিটেড অফার',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDE_DATA.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-150 flex items-center py-10 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-8 z-10">
          <header className="space-y-6">
            <h1 className="text-[40px] md:text-6xl font-black text-text tracking-tighterer leading-[1.3]">
              প্রযুক্তির আসল স্বাদ, <br />
              <span className="text-transparent text-[56px] md:text-7xl bg-clip-text bg-linear-to-r from-primary via-secondary to-primary">
                এখন আপনার হাতের মুঠোয়।
              </span>
            </h1>
            <p className="text-pText text-base md:text-lg max-w-xl leading-relaxed font-medium">
              গ্যাজেট বিডিএস-এ আমরা দিচ্ছি ১০০% অরিজিনাল ব্র্যান্ডের নিশ্চয়তা। সরাসরি ইমপোর্ট করা
              পণ্য এখন আপনার দোরগোড়ায়।
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              aria-label="কালেকশন দেখুন"
              url="/shop"
              size="lg"
              icon={ArrowRight}
              text="কালেকশন দেখুন"
              className="w-full sm:w-fit"
            />
          </div>

          <div className="pt-8 flex flex-wrap gap-7 md:gap-10 border-t border-border/20">
            <TrustBadge
              icon={<Zap size={20} className="text-secondary" />}
              title="দ্রুত ডেলিভারি"
              desc="সারা বাংলাদেশে"
            />
            <TrustBadge
              icon={<Globe size={20} className="text-primary" />}
              title="সহজ রিটার্ন"
              desc="৭ দিনের পলিসি"
              className="hidden md:flex"
            />
            <TrustBadge
              icon={<Activity size={20} className="text-green-600" />}
              title="অরিজিনাল পণ্য"
              desc="১০০% গ্যারান্টি"
              isLive
            />
          </div>
        </div>

        {/* --- ডান পাশ: স্লাইডার (Optimized for LCP) --- */}
        <div className="hidden lg:flex relative w-full h-125 items-center justify-end">
          {/* Background Glow - Static for performance */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={isLoaded ? { opacity: 0, x: 20 } : false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md h-full flex items-center justify-center"
            >
              <Image
                src={SLIDE_DATA[currentSlide].img}
                alt={SLIDE_DATA[currentSlide].title}
                width={500}
                height={500}
                priority={currentSlide === 0} // শুধু প্রথম স্লাইড প্রায়োরিটি পাবে
                fetchPriority={currentSlide === 0 ? 'high' : 'low'}
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                className="object-contain drop-shadow-2xl"
                quality={75}
              />
            </motion.div>
          </AnimatePresence>

          {/* Floating Badge - Simple and Light */}
          <div className="absolute bottom-10 left-0 bg-card/90 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-2xl z-30 flex items-center gap-3">
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-pText/80 uppercase">অরিজিনাল</p>
              <p className="text-sm font-black text-text">গ্যারান্টিড প্রোডাক্ট</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Small Component to keep code clean
function TrustBadge({ icon, title, desc, className = '', isLive = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {icon}
        {isLive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-base font-black text-pText uppercase">{title}</span>
        <span className="text-sm text-pText uppercase tracking-tighterer mt-1">{desc}</span>
      </div>
    </div>
  );
}
