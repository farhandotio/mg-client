'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchAllProducts } from '@/store/features/productSlice';
import { fetchCategories } from '@/store/features/categorySlice';
import ProductCard from '@/components/ProductCard';
import { Filter, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import debounce from 'lodash.debounce';
import ShopSidebar from './components/ShopSidebar';

export default function ShopPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Redux Store
  const { products, loading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  // ১. URL থেকে র ভ্যালু নেওয়া
  const categoryQuery = searchParams.get('category') || '';
  const searchTerm = searchParams.get('search') || '';
  const priceRange = Number(searchParams.get('maxPrice')) || 200000;
  const sortBy = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // ২. ক্যাটাগরি লিস্ট ফেচ করা
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const selectedCategoryId = useMemo(() => {
    if (!categoryQuery) return '';

    const found = categories.find(
      (c) =>
        c._id === categoryQuery ||
        c.slug?.toLowerCase() === categoryQuery.toLowerCase() ||
        c.name?.toLowerCase() === categoryQuery.toLowerCase()
    );

    return found ? found._id : categoryQuery;
  }, [categoryQuery, categories]);

  const updateURL = useCallback(
    (paramsObj) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // ৫. প্রোডাক্ট ফেচ লজিক
  const fetchFilteredProducts = useCallback(() => {
    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', 8);
    query.append('sort', sortBy);
    query.append('price.base[lte]', priceRange);

    if (selectedCategoryId) query.append('category', selectedCategoryId);
    if (searchTerm) query.append('search', searchTerm);

    dispatch(fetchAllProducts(query.toString()));
  }, [selectedCategoryId, priceRange, sortBy, searchTerm, page, dispatch]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  // ৬. হ্যান্ডলারস
  const debouncedSearch = useMemo(
    () => debounce((value) => updateURL({ search: value, page: 1 }), 500),
    [updateURL]
  );

  const onSearchChange = (e) => debouncedSearch(e.target.value);

  const handlePagination = (newPage) => {
    updateURL({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    router.push('/shop');
    setIsMobileFilterOpen(false);
  };

  const filterProps = {
    categories,
    searchTerm,
    onSearchChange,
    selectedCategory: selectedCategoryId, // ID পাঠানো হচ্ছে যাতে সাইডবারে বাটন একটিভ থাকে
    setSelectedCategory: (val) => updateURL({ category: val, page: 1 }),
    priceRange,
    setPriceRange: (val) => updateURL({ maxPrice: val, page: 1 }),
    resetFilters,
    setIsMobileFilterOpen,
  };

  return (
    <div className="bg-bg min-h-screen pt-5 pb-20 px-4 lg:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black text-text italic tracking-tighter uppercase leading-none">
              Vault <span className="text-primary">Catalog</span>
            </h1>
            <p className="text-pText text-[10px] font-black mt-3 uppercase tracking-widest opacity-80">
              {loading ? 'Scanning...' : `Found ${pagination?.totalProducts || 0} Units`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-card border border-border px-6 py-4 rounded-2xl text-[10px] font-black uppercase active:scale-95 transition-all"
            >
              <Filter size={14} className="text-primary" /> Filters
            </button>

            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => updateURL({ sort: e.target.value, page: 1 })}
                className="appearance-none bg-card border border-border px-8 py-4 pr-12 rounded-2xl text-[10px] font-black uppercase outline-none cursor-pointer hover:border-primary/50 transition-all"
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

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card/30 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] sticky top-28">
              <ShopSidebar {...filterProps} />
            </div>
          </aside>

          {/* Main Grid Content */}
          <main className="grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <Loader2 className="animate-spin text-primary" size={50} />
                <p className="text-pText font-black uppercase tracking-widest text-[10px]">
                  Syncing...
                </p>
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <div className="mt-16 flex justify-center items-center gap-4">
                    <button
                      disabled={page === 1}
                      onClick={() => handlePagination(page - 1)}
                      className="p-4 bg-card border border-border rounded-2xl disabled:opacity-20 hover:border-primary transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-[10px] font-black uppercase bg-card px-6 py-4 rounded-2xl border border-border">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={page === pagination.totalPages}
                      onClick={() => handlePagination(page + 1)}
                      className="p-4 bg-card border border-border rounded-2xl disabled:opacity-20 hover:border-primary transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40 bg-card/10 rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center">
                <Search size={32} className="text-pText/40 mb-6" />
                <h3 className="text-2xl font-black uppercase italic">No Units Detected</h3>
                <button
                  onClick={resetFilters}
                  className="mt-8 text-primary font-black uppercase text-[10px] underline underline-offset-8"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] bg-bg border-r border-border p-8 overflow-y-auto animate-in slide-in-from-left duration-500 shadow-2xl">
            <ShopSidebar {...filterProps} />
          </div>
        </div>
      )}
    </div>
  );
}
