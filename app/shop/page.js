'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import ProductCard from '@/components/ProductCard';
import { Filter, Search, Loader2, X } from 'lucide-react';
import debounce from 'lodash.debounce';
import ShopSidebar from './components/ShopSidebar';

export default function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  // --- States ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(150000); // ডিফল্ট হাই প্রাইজ সেট করা ভালো
  const [sortBy, setSortBy] = useState('-createdAt');

  // --- Actions ---

  // ১. এপিআই কল করার মেইন ফাংশন
  const fetchFilteredProducts = useCallback(() => {
    let query = `price.base[lte]=${priceRange}&sort=${sortBy}`;
    if (selectedCategory) query += `&category=${selectedCategory}`;
    if (searchTerm) query += `&search=${searchTerm}`;

    dispatch(fetchAllProducts(query));
  }, [selectedCategory, priceRange, sortBy, searchTerm, dispatch]);

  // ২. ফিল্টার চেঞ্জ হলে ডাটা ফেচ করা
  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // ৩. সার্চ হ্যান্ডলিং (Debounced)
  // useMemo ব্যবহার না করলে প্রতি রেন্ডারে নতুন ফাংশন তৈরি হয় যা কাজ করবে না
  const debouncedSearch = useMemo(() => debounce((value) => setSearchTerm(value), 500), []);

  const onSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // ৪. রিসেট ফিল্টার
  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange(150000);
    setSearchTerm('');
    // ইনপুট ফিল্ড ক্লিয়ার করার জন্য পেজ রিফ্রেশ বা ইনপুট রিফ ব্যবহার করা যেতে পারে
  };

  const filterProps = {
    searchTerm,
    onSearchChange, // handleSearch এর বদলে এটি ব্যবহার করুন
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    resetFilters,
    setIsMobileFilterOpen,
  };

  return (
    <div className="bg-bg min-h-screen pt-5 pb-20 px-4 lg:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        {/* --- Header Section --- */}
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">
            <span className="hover:text-primary cursor-pointer">Home</span>
            <span className="text-primary">/</span>
            <span className="text-text">Shop</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-text italic tracking-tighter uppercase leading-none">
                Vault <span className="text-primary">Catalog</span>
              </h1>
              <p className="text-pText text-xs font-bold mt-3 uppercase tracking-widest opacity-80">
                {loading
                  ? 'Scanning Inventory...'
                  : `Found ${products?.length || 0} Hardware Units`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-card border border-border px-6 py-4 rounded-2xl text-text text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                <Filter size={14} className="text-primary" /> Filters
              </button>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-card border border-border px-8 py-4 pr-12 rounded-2xl text-text text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-primary/50 transition-all"
                >
                  <option value="-createdAt">Latest Hardware</option>
                  <option value="price.base">Price: Bottom Up</option>
                  <option value="-price.base">Price: Top Down</option>
                  <option value="-sold">Most Popular</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <Filter size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* --- Desktop Sidebar --- */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] sticky top-28">
              <ShopSidebar {...filterProps} />
            </div>
          </aside>

          {/* --- Mobile Sidebar (Drawer) --- */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-100 lg:hidden">
              <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-[85%] bg-bg border-r border-border p-8 shadow-2xl animate-in slide-in-from-left duration-500 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-black italic uppercase text-xl">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 bg-card rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ShopSidebar {...filterProps} />
              </div>
            </div>
          )}

          {/* --- Main Product Content --- */}
          <main className="grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="relative">
                  <Loader2 className="animate-spin text-primary" size={50} strokeWidth={1} />
                  <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse"></div>
                </div>
                <p className="text-pText font-black uppercase tracking-[0.3em] text-[10px]">
                  Calibrating Inventory...
                </p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
                {products.map((product, index) => (
                  <div
                    key={product._id}
                    className="animate-in fade-in slide-in-from-bottom-10 duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-card/10 rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center">
                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-pText/40" />
                </div>
                <h3 className="text-3xl font-black text-text italic uppercase tracking-tighter">
                  No Units Detected
                </h3>
                <p className="text-pText text-sm mt-2 max-w-xs mx-auto">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-8 text-primary font-black uppercase text-[10px] tracking-widest underline underline-offset-8"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
