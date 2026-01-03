'use client';
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '@/components/Button';

export default function ShopSidebar({
  searchTerm,
  handleSearch,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  resetFilters,
  setIsMobileFilterOpen,
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h3 className="text-text font-bold uppercase tracking-wider">Filters</h3>
        </div>
        {/* মোবাইলে ক্লোজ বাটন */}
        <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden text-pText">
          <X size={24} />
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-8">
        <p className="text-text font-bold mb-4 uppercase text-[10px] tracking-[0.2em]">
          Search Product
        </p>
        <div className="relative">
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={handleSearch}
            placeholder="Search keywords..."
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary/50"
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-pText" />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <p className="text-text font-bold mb-4 uppercase text-[10px] tracking-[0.2em]">
          Categories
        </p>
        <div className="space-y-2">
          {['', 'Smartphones', 'Laptops', 'Headphones', 'Gaming', 'Watches'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-primary/10 text-primary'
                  : 'text-pText hover:bg-white/5'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedCategory === cat ? 'bg-primary' : 'bg-border'
                }`}
              />
              <span className="text-sm font-bold">{cat || 'All Categories'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-text font-bold uppercase text-[10px] tracking-[0.2em]">Max Price</p>
          <span className="text-primary font-black text-sm">${priceRange}</span>
        </div>
        <input
          type="range"
          min="0"
          max="3000"
          step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <Button text="Reset Filters" size="sm" bgColor="bg-white/5" onClick={resetFilters} />
    </div>
  );
}
