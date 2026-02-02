'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  ChevronRight,
  Activity,
  Zap,
  Star,
  Flame,
  Package,
  RotateCcw,
  LayoutGrid,
} from 'lucide-react';

export default function ShopSidebar({
  categories,
  searchTerm,
  onSearchChange,
  selectedCategory,
  priceRange,
  setPriceRange,
  resetFilters,
  setIsMobileFilterOpen,
}) {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('productType') || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  const gearTypes = [
    { name: 'ফিচারড পণ্য', slug: 'Featured', icon: <Star size={14} /> },
    { name: 'বেস্ট সেলার', slug: 'BestSeller', icon: <Flame size={14} /> },
    { name: 'ফ্ল্যাশ ডিল', slug: 'FlashSale', icon: <Zap size={14} /> },
    { name: 'নতুন কালেকশন', slug: 'NewArrival', icon: <Activity size={14} /> },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 max-w-full overflow-hidden no-scrollbar pb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-primary" />
            <h3 className="text-text font-black uppercase tracking-tighter text-sm italic">
              ফিল্টার
            </h3>
          </div>
          <button
            aria-label='reset filters'
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-[12px] font-black uppercase text-red-500 hover:text-red-400 transition-colors group"
          >
            <RotateCcw
              size={12}
              className="group-hover:-rotate-180 transition-transform duration-500"
            />
            রিসেট করুন
          </button>
        </div>
        <div className="h-0.5 w-full bg-linear-to-r from-primary/50 via-border/20 to-transparent" />
      </div>

      {/* ২. কিওয়ার্ড সার্চ */}
      <div className="relative group">
        <input
          type="text"
          defaultValue={searchTerm}
          onChange={onSearchChange}
          placeholder="পণ্য খুঁজুন..."
          className="w-full bg-white/5 border border-border/40 rounded-md py-3 pl-11 pr-4 text-xs text-text focus:outline-none focus:border-primary/50 transition-all placeholder:text-pText/30"
        />
        <Search
          size={14}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-pText/40 group-focus-within:text-primary transition-colors"
        />
      </div>

      {/* ৩. ক্যাটাগরি লিস্ট (নতুন মিনিমাল ডিজাইন) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <LayoutGrid size={12} className="text-primary/60" />
          <label className="text-[12px] font-black uppercase tracking-[0.2em] text-pText/60">
            ক্যাটাগরি সমূহ
          </label>
        </div>

        <div className="flex flex-col gap-0.5">
          <Link
            href="/shop"
            className={`group flex items-center justify-between py-2 px-3 rounded-md transition-all ${
              !selectedCategory ? 'bg-primary/10 text-primary' : 'text-pText hover:bg-white/5'
            }`}
            onClick={() => setIsMobileFilterOpen?.(false)}
          >
            <span className="text-[11px] font-bold uppercase tracking-wide">সব পণ্য</span>
            <div
              className={`w-1 h-1 rounded-full ${!selectedCategory ? 'bg-primary' : 'bg-transparent'}`}
            />
          </Link>

          {categories?.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}${selectedType ? `&productType=${selectedType}` : ''}`}
              className={`group flex items-center justify-between py-2 px-3 rounded-md transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-primary/10 text-primary'
                  : 'text-pText hover:bg-white/5'
              }`}
              onClick={() => setIsMobileFilterOpen?.(false)}
            >
              <span className="text-[11px] font-bold uppercase tracking-wide truncate pr-4 italic">
                {cat.name}
              </span>
              {selectedCategory === cat.slug ? (
                <ChevronRight size={12} className="text-primary animate-in slide-in-from-left-2" />
              ) : (
                <span className="text-[11px] opacity-20 font-mono group-hover:opacity-100 transition-opacity italic">
                  #0{cat.slug.length}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ৪. গিয়ার টাইপ (স্লিম চিপস) */}
      <div className="space-y-4">
        <label className="text-[12px] font-black uppercase tracking-[0.2em] text-pText/60 px-1">
          কালেকশন টাইপ
        </label>
        <div className="grid grid-cols-1 gap-2">
          {gearTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/shop?productType=${type.slug}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
              className={`flex items-center justify-between p-3 rounded-md border text-[12px] font-black uppercase tracking-tighter transition-all ${
                selectedType === type.slug
                  ? 'bg-primary text-bg border-primary'
                  : 'bg-white/5 border-border/20 text-pText hover:border-primary/40'
              }`}
              onClick={() => setIsMobileFilterOpen?.(false)}
            >
              <div className="flex items-center gap-2">
                <span className={selectedType === type.slug ? 'text-bg' : 'text-primary'}>
                  {type.icon}
                </span>
                {type.name}
              </div>
              {selectedType === type.slug && <Zap size={10} fill="currentColor" />}
            </Link>
          ))}
        </div>
      </div>

      {/* ৫. বাজেট স্লাইডার */}
      <div className="space-y-5 pt-2">
        <div className="flex justify-between items-end px-1">
          <div className="flex flex-col">
            <label className="text-[12px] font-black uppercase tracking-[0.2em] text-pText/60">
              বাজেট লিমিট
            </label>
            <span className="text-[10px] font-bold text-pText/40 uppercase mt-0.5">
              সর্বোচ্চ সীমা নির্ধারণ করুন
            </span>
          </div>
          <span className="text-primary font-black text-xs font-mono">
            ৳{priceRange.toLocaleString()}
          </span>
        </div>
        <div className="px-1 relative h-6 flex items-center">
          <input
            type="range"
            min="500"
            max="200000"
            step="500"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
          />
          {/* স্লাইডার প্রগ্রেস ইন্ডিকেটর (Visual) */}
          <div
            className="absolute left-0 h-1 bg-primary rounded-full pointer-events-none"
            style={{ width: `${((priceRange - 500) / (200000 - 500)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-black text-pText/30 uppercase tracking-tighter px-1">
          <span>৳৫০০</span>
          <span>৳২,০০,০০০</span>
        </div>
      </div>

      {/* সিস্টেম স্ট্যাটাস */}
      <div className="pt-4 border-t border-border/10">
        <div className="flex items-center gap-2 opacity-30 group hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            সিস্টেম সিঙ্ক: অনলাইন
          </span>
        </div>
      </div>
    </div>
  );
}
