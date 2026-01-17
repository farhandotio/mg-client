'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // এটি যোগ করা হয়েছে URL চেক করার জন্য
import { Search, Filter, X, ChevronRight, Activity, Zap, Star, Flame, Package } from 'lucide-react';

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
  const selectedType = searchParams.get('productType') || ''; // বর্তমান টাইপ চেক করা

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gear Types Data (আপনার ব্যাকএন্ড Enum অনুযায়ী)
  const gearTypes = [
    { name: 'Featured', slug: 'Featured', icon: <Star size={12} /> },
    { name: 'Best Sellers', slug: 'BestSeller', icon: <Flame size={12} /> },
    { name: 'Flash Deals', slug: 'FlashSale', icon: <Zap size={12} /> },
    { name: 'New Arrivals', slug: 'NewArrival', icon: <Activity size={12} /> },
    { name: 'Hot Deals', slug: 'HotDeals', icon: <Flame size={12} className="text-orange-500" /> },
    { name: 'Regular Gear', slug: 'Regular', icon: <Package size={12} /> },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-6 relative">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/30">
            <Filter size={14} className="text-primary" />
          </div>
          <div>
            <h3 className="text-text font-black uppercase tracking-widest text-[11px] italic leading-none">
              System_Filters
            </h3>
            <div className="flex items-center gap-1 mt-1 opacity-40">
              <Activity size={8} className="text-primary" />
              <span className="text-[7px] font-bold uppercase tracking-tighter">Nodes_Active</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMobileFilterOpen(false)}
          className="lg:hidden p-2 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10"
        >
          <X size={20} className="text-pText" />
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 flex items-center gap-2">
          Keyword_Search
        </label>
        <div className="relative group">
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={onSearchChange}
            placeholder="Scanning for units..."
            className="w-full bg-white/5 border border-border/60 rounded-2xl py-4 px-5 text-xs text-text focus:outline-none focus:border-primary transition-all shadow-inner"
          />
          <Search
            size={14}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-pText group-focus-within:text-primary"
          />
        </div>
      </div>

      {/* 2. Gear Type Filter (NEW SECTION) */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 flex items-center gap-2">
          Hardware_Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {gearTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/shop?productType=${type.slug}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
              className={`flex items-center gap-3 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                selectedType === type.slug
                  ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.1)]'
                  : 'bg-white/5 border-border/40 text-pText hover:border-primary/30'
              }`}
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <span className={selectedType === type.slug ? 'text-primary' : 'text-pText/50'}>
                {type.icon}
              </span>
              {type.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Categories (Sector Nodes) */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70 flex items-center gap-2">
          Sector_Nodes
        </label>
        <div className="space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar">
          <Link
            href="/shop"
            className={`group flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${
              !selectedCategory
                ? 'bg-primary border-primary text-black'
                : 'bg-white/5 border-border/40 text-pText hover:border-primary/50'
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              All_Hardware
            </span>
            <ChevronRight
              size={12}
              className={!selectedCategory ? 'text-black' : 'text-pText/30'}
            />
          </Link>

          {categories?.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}${selectedType ? `&productType=${selectedType}` : ''}`}
              className={`group flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 ${
                selectedCategory === cat.slug
                  ? 'bg-primary border-primary text-black'
                  : 'bg-white/5 border-border/40 text-pText hover:border-primary/50'
              }`}
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <span className="text-[10px] font-black uppercase tracking-widest italic">
                {cat.name}
              </span>
              <ChevronRight
                size={12}
                className={selectedCategory === cat.slug ? 'text-black' : 'text-pText/30'}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Price Limit */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-end">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/70">
            Budget_Limit
          </label>
          <span className="text-primary font-black text-[12px] italic bg-primary/10 px-2 py-1 rounded border border-primary/20">
            ৳{priceRange.toLocaleString()}
          </span>
        </div>
        <div className="relative px-1">
          <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
              style={{ width: `${(priceRange / 200000) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="500"
            max="200000"
            step="500"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="absolute -top-1.5 left-0 w-full accent-primary h-4 bg-transparent appearance-none cursor-pointer z-20"
          />
        </div>
      </div>

      {/* Reset */}
      <div className="pt-6">
        <button
          onClick={resetFilters}
          className="w-full py-5 bg-white/5 border border-border/40 rounded-2xl text-[9px] font-black uppercase tracking-[0.5em] text-pText hover:text-red-500 hover:border-red-500/50 transition-all active:scale-[0.98]"
        >
          Clear_System_State
        </button>
      </div>
    </div>
  );
}
