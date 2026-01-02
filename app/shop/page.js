'use client';
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Grid2X2, List, ChevronDown, Search, Filter, X } from 'lucide-react';
import { products } from '@/context/data';

export default function ShopPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4 lg:block">
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
        <p className="text-text font-bold mb-4 uppercase text-xs tracking-widest">Search</p>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary/50"
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-pText" />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <p className="text-text font-bold mb-4 uppercase text-xs tracking-widest">Categories</p>
        <div className="space-y-3">
          {['Smartphones', 'Laptops', 'Headphones', 'Gaming', 'Watches'].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-5 h-5 border-2 border-border rounded-full flex items-center justify-center group-hover:border-primary transition-all">
                <div className="w-2.5 h-2.5 bg-primary rounded-full opacity-0 group-hover:opacity-100"></div>
              </div>
              <span className="text-pText text-sm group-hover:text-text transition-all">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <p className="text-text font-bold mb-4 uppercase text-xs tracking-widest">Price Range</p>
        <input
          type="range"
          className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-4 text-xs font-bold text-pText">
          <span>$0</span>
          <span>$3000</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pt-5 pb-20 px-4 lg:px-12">
      {' '}
      {/* pt-20 padding কমিয়ে আনা হয়েছে */}
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="mb-6">
          <p className="text-pText text-xs mb-2">
            Home &gt; <span className="text-text font-bold">Shop</span>
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl lg:text-4xl font-black text-text uppercase"> All Products </h1>

            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              {/* মোবাইলের জন্য ফিল্টার বাটন */}
              <button
                onClick={()=> setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-text text-sm font-bold"
              > 
                <Filter size={16} /> Filters
              </button>

              <div className="flex items-center gap-3">
                <button className="bg-card border border-border px-4 py-2 rounded-xl text-text text-sm font-bold flex items-center gap-2">
                  Sort <ChevronDown size={14} />
                </button>
                <div className="hidden sm:flex bg-card border border-border p-1 rounded-xl">
                  <button className="p-2 bg-primary text-bg rounded-lg">
                    <Grid2X2 size={18} />
                  </button>
                  <button className="p-2 text-pText">
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Desktop Sidebar Filter --- */}
          <aside className="hidden lg:block w-70 shrink-0">
            <div className="bg-card border border-border p-8 rounded-2xl sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* --- Mobile Filter Drawer --- */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-100 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              ></div>
              <div className="absolute left-0 top-0 h-full w-[80%] max-w-75 bg-card p-6 shadow-2xl animate-in slide-in-from-left duration-300">
                <FilterContent />
              </div>
            </div>
          )}

          {/* --- Product Grid --- */}
          <main className="grow">
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
