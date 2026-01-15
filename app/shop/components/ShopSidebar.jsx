'use client';
import React from 'react';
import Link from 'next/link';
import { Search, Filter, X } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      {/* --- Sidebar Header --- */}
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h3 className="text-text font-bold uppercase tracking-wider">Filters</h3>
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileFilterOpen(false)}
          className="lg:hidden text-pText hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* --- Search Filter --- */}
      <div className="mb-8">
        <p className="text-text font-bold mb-4 uppercase text-[10px] tracking-[0.2em]">
          Search Product
        </p>
        <div className="relative">
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={onSearchChange}
            placeholder="Search keywords..."
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary/50 transition-all"
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-pText" />
        </div>
      </div>

      {/* --- Categories Filter --- */}
      <div className="mb-8">
        <p className="text-text font-bold mb-4 uppercase text-[10px] tracking-[0.2em]">
          Categories
        </p>
        <div className="space-y-1">
          {/* All Hardware */}
          <Link
            href="/shop"
            className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all ${
              !selectedCategory ? 'bg-primary/10 text-primary' : 'text-pText hover:bg-card'
            }`}
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                !selectedCategory ? 'bg-primary' : 'bg-border'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider">All Hardware</span>
          </Link>

          {/* Dynamic Categories */}
          {categories?.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop/category/${cat.slug}`}
              className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-primary/10 text-primary'
                  : 'text-pText hover:bg-card'
              }`}
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  selectedCategory === cat.slug ? 'bg-primary' : 'bg-border'
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* --- Price Range --- */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-text font-bold uppercase text-[10px] tracking-[0.2em]">Max Price</p>
          <span className="text-primary font-black text-xs">৳{priceRange.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="500"
          max="200000"
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* --- Reset Filters --- */}
      <button
        onClick={resetFilters}
        className="w-full py-4 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary/50 transition-all active:scale-95 shadow-sm"
      >
        Reset Filters
      </button>
    </div>
  );
}
