'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchAllProducts } from '@/store/features/productSlice';
import { fetchCategories } from '@/store/features/categorySlice';
import ProductCard from '@/components/ProductCard';
import ShopSidebar from './ShopSidebar';
import Skeleton from '@/components/Skeleton';
import { Filter, Search, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import debounce from 'lodash.debounce';

export default function ShopPageContent({ categorySlug }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  // ১. মাউন্ট হওয়ার সময় ক্যাটাগরি লোড করা
  useEffect(() => {
    setMounted(true);
    dispatch(fetchCategories());
  }, [dispatch]);

  const { products, loading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  // ২. URL Params থেকে ডেটা নেওয়া
  const searchTerm = searchParams.get('search') || '';
  const priceRange = Number(searchParams.get('maxPrice')) || 200000;
  const sortBy = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;
  const urlCategory = searchParams.get('category') || categorySlug || '';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ৩. URL Update Helper
  const updateURL = useCallback(
    (paramsObj) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value || value === 0) params.set(key, value);
        else params.delete(key);
      });

      if (!paramsObj.page) params.set('page', 1);

      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // ৪. স্লাগ থেকে ক্যাটাগরি ID খুঁজে বের করা (FIX)
  const activeCategoryId = useMemo(() => {
    if (!urlCategory || categories.length === 0) return null;
    const found = categories.find((c) => c.slug === urlCategory);
    return found ? found._id : urlCategory; // যদি আইডি পাওয়া যায় তবে আইডি, নাহলে স্লাগই পাঠাবে
  }, [urlCategory, categories]);

  // ৫. Fetch Products (ডিপেন্ডেন্সি লিস্টে activeCategoryId যোগ করা হয়েছে)
  const fetchFilteredProducts = useCallback(() => {
    if (!mounted) return;

    // যদি ইউআরএল এ ক্যাটাগরি থাকে কিন্তু ক্যাটাগরি লিস্ট এখনও লোড না হয়, তবে অপেক্ষা করুন
    if (urlCategory && categories.length === 0) return;

    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', 12);
    query.append('sort', sortBy);
    query.append('price.base[lte]', priceRange);

    // ব্যাকএন্ডে ID পাঠানো হচ্ছে (স্লাগ এর বদলে)
    if (activeCategoryId) {
      query.append('category', activeCategoryId);
    }

    if (searchTerm) query.append('search', searchTerm);

    dispatch(fetchAllProducts(query.toString()));
  }, [
    mounted,
    page,
    sortBy,
    priceRange,
    activeCategoryId,
    urlCategory,
    categories.length,
    searchTerm,
    dispatch,
  ]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // ৬. Debounced Search
  const debouncedSearch = useMemo(
    () => debounce((value) => updateURL({ search: value, page: 1 }), 500),
    [updateURL]
  );

  const handlePagination = (newPage) => {
    updateURL({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    router.push('/shop');
    setIsMobileFilterOpen(false);
  };

  if (!mounted) return null;

  const filterProps = {
    categories,
    searchTerm,
    onSearchChange: (e) => debouncedSearch(e.target.value),
    selectedCategory: urlCategory,
    setPriceRange: (val) => updateURL({ maxPrice: val, page: 1 }),
    priceRange,
    resetFilters,
    setIsMobileFilterOpen,
  };

  return (
    <div className="bg-bg min-h-screen pb-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 pt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Globe size={14} className="animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                Global_Inventory
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-text italic tracking-tighter uppercase leading-none">
              Vault <span className="text-primary">Catalog</span>
            </h1>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-lg text-xs font-black uppercase active:scale-95"
            >
              <Filter size={14} className="text-primary" /> Filters
            </button>
            <p className="text-pText text-[10px] font-black uppercase tracking-widest opacity-80">
              {loading ? 'Scanning...' : `Captured: ${pagination?.totalProducts || 0} Units`}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-70 shrink-0">
            <div className="bg-card/30 backdrop-blur-xl p-5 rounded-3xl border border-border/50 sticky top-28 shadow-2xl shadow-primary/5">
              <ShopSidebar {...filterProps} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="grow">
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                <Skeleton type="product" count={8} />
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-4">
                    <button
                      disabled={page === 1}
                      onClick={() => handlePagination(page - 1)}
                      className="p-5 bg-card border border-border rounded-2xl disabled:opacity-20 hover:border-primary transition-all active:scale-90"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-[10px] font-black uppercase bg-card px-8 py-5 rounded-2xl border border-border tracking-widest">
                      {page} / {pagination.totalPages}
                    </span>
                    <button
                      disabled={page === pagination.totalPages}
                      onClick={() => handlePagination(page + 1)}
                      className="p-5 bg-card border border-border rounded-2xl disabled:opacity-20 hover:border-primary transition-all active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40 bg-card/10 border border-dashed border-border rounded-3xl flex flex-col items-center">
                <Search size={40} className="text-pText/20 mb-6" />
                <h3 className="text-2xl font-black uppercase italic text-pText/40 tracking-tighter">
                  No Units Detected
                </h3>
                <button
                  onClick={resetFilters}
                  className="mt-8 bg-primary/10 text-primary px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest border border-primary/20 hover:bg-primary hover:text-black transition-all"
                >
                  Clear System Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] bg-bg border-r border-border p-8 overflow-y-auto animate-in slide-in-from-left duration-500">
            <ShopSidebar {...filterProps} />
          </div>
        </div>
      )}
    </div>
  );
}
