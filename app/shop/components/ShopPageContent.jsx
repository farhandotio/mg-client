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

  // 1. Core States & Hydration
  const [mounted, setMounted] = useState(false);
  const { products, loading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCategories());
  }, [dispatch]);

  // 2. Extract URL Parameters
  const searchTerm = searchParams.get('search') || '';
  const priceRange = Number(searchParams.get('maxPrice')) || 200000;
  const sortBy = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;
  const urlCategory = searchParams.get('category') || categorySlug || '';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 3. SEO - Dynamic Schema Markup (JSON-LD)
  // এটি সার্চ ইঞ্জিনকে আপনার শপের ক্যাটাগরি এবং আইটেম সম্পর্কে ডেটা দেয়
  const jsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: urlCategory ? `${urlCategory} - Vault Catalog` : 'Vault Catalog - Shop All Products',
      description: `Browse our high-performance inventory in ${urlCategory || 'all categories'}.`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
  }, [urlCategory]);

  // 4. Logic: Slug to ID Conversion (Fix for Backend query)
  const activeCategoryId = useMemo(() => {
    if (!urlCategory || categories.length === 0) return null;
    const found = categories.find((c) => c.slug === urlCategory);
    return found ? found._id : urlCategory;
  }, [urlCategory, categories]);

  // 5. URL Update Handler
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

  // 6. Fetch Data Logic
  const fetchFilteredProducts = useCallback(() => {
    if (!mounted) return;
    if (urlCategory && categories.length === 0) return;

    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', 12);
    query.append('sort', sortBy);
    query.append('price.base[lte]', priceRange);

    if (activeCategoryId) query.append('category', activeCategoryId);
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

  // 7. Actions & Handlers
  const debouncedSearch = useMemo(
    () => debounce((value) => updateURL({ search: value, page: 1 }), 500),
    [updateURL]
  );

  const handlePagination = (newPage) => {
    updateURL({ page: newPage });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <section className="bg-bg min-h-screen pb-20 animate-in fade-in duration-700">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="">
        {/* SEO Optimization: Semantic Header */}
        <header className="mb-10 pt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Globe size={14} className="animate-spin-slow" aria-hidden="true" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                Global_Inventory
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-text italic tracking-tighter uppercase leading-none">
              Vault{' '}
              <span className="text-primary">
                {urlCategory ? urlCategory.replace(/-/g, ' ') : 'Catalog'}
              </span>
            </h1>
            {/* SEO: Hidden H2 for search spiders */}
            <h2 className="sr-only">Premium products available in our shop</h2>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-lg text-xs font-black uppercase active:scale-95 hover:border-primary/50 transition-colors"
              aria-label="Open filter sidebar"
            >
              <Filter size={14} className="text-primary" /> Filters
            </button>
            <p
              className="text-pText text-[10px] font-black uppercase tracking-widest opacity-80"
              aria-live="polite"
            >
              {loading ? 'Scanning_Nodes...' : `Captured: ${pagination?.totalProducts || 0} Units`}
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar (SEO: Semantic Aside) */}
          <aside className="hidden lg:block w-70 shrink-0">
            <nav className="bg-card/30 backdrop-blur-xl p-4 rounded-3xl border border-border/50 sticky top-28 shadow-2xl shadow-primary/5">
              <ShopSidebar {...filterProps} />
            </nav>
          </aside>

          {/* Product Feed */}
          <main className="grow">
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5" aria-busy="true">
                <Skeleton type="product" count={8} />
              </div>
            ) : products?.length > 0 ? (
              <div className="space-y-20">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination (SEO: Nav with labels) */}
                {pagination?.totalPages > 1 && (
                  <nav
                    className="flex justify-center items-center gap-4"
                    aria-label="Product pagination"
                  >
                    <button
                      disabled={page === 1}
                      onClick={() => handlePagination(page - 1)}
                      className="p-5 bg-card border border-border rounded-2xl disabled:opacity-20 hover:border-primary transition-all active:scale-90"
                      aria-label="Go to previous page"
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
                      aria-label="Go to next page"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                )}
              </div>
            ) : (
              <div className="text-center py-40 bg-card/10 border border-dashed border-border rounded-3xl flex flex-col items-center">
                <Search size={40} className="text-pText/20 mb-6" aria-hidden="true" />
                <h3 className="text-2xl font-black uppercase italic text-pText/40 tracking-tighter">
                  No Units Detected In Sector
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

      {/* Mobile Sidebar Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <nav className="absolute left-0 top-0 h-full w-[85%] bg-bg border-r border-border p-8 overflow-y-auto animate-in slide-in-from-left duration-500">
            <ShopSidebar {...filterProps} />
          </nav>
        </div>
      )}
    </section>
  );
}
