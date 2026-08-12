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
import { motion } from 'framer-motion';

export default function ShopPageContent({ categorySlug }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const { products, loading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCategories());
  }, [dispatch]);

  const searchTerm = searchParams.get('search') || '';
  const priceRange = Number(searchParams.get('maxPrice')) || 200000;
  const sortBy = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;
  const urlCategory = searchParams.get('category') || categorySlug || '';
  const productType = searchParams.get('productType') || '';

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeCategoryId = useMemo(() => {
    if (!urlCategory || categories.length === 0) return null;
    const found = categories.find((c) => c.slug === urlCategory);
    return found ? found._id : urlCategory;
  }, [urlCategory, categories]);

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

  const fetchFilteredProducts = useCallback(() => {
    if (!mounted) return;
    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', 12);
    query.append('sort', sortBy);
    query.append('price.base[lte]', priceRange);
    if (activeCategoryId) query.append('category', activeCategoryId);
    if (searchTerm) query.append('search', searchTerm);
    if (productType) query.append('productType', productType);

    dispatch(fetchAllProducts(query.toString()));
  }, [mounted, page, sortBy, priceRange, activeCategoryId, searchTerm, productType, dispatch]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

  const handlePagination = (newPage) => {
    updateURL({ page: newPage });
    const productFeed = document.getElementById('product-feed-container');
    if (productFeed) {
      productFeed.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  const filterProps = {
    categories,
    searchTerm,
    onSearchChange: (e) => debounce((v) => updateURL({ search: v, page: 1 }), 500)(e.target.value),
    selectedCategory: urlCategory,
    setPriceRange: (val) => updateURL({ maxPrice: val, page: 1 }),
    priceRange,
    resetFilters: () => router.push('/shop'),
    setIsMobileFilterOpen,
  };

  return (
    <section className="bg-bg h-[95vh] overflow-hidden flex flex-col">
      <div className="w-full flex flex-col h-full">
        <header className="pb-4 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Globe size={14} className="animate-spin-slow" />
                <span className="text-[12px] font-medium uppercase tracking-tighter">
                  গ্লোবাল_ইনভেন্টরি_লিস্ট
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-card border border-border/50 px-4 py-2.5 rounded-0 text-[12px] font-medium uppercase tracking-wider"
              >
                <Filter size={14} className="text-primary" /> ফিল্টার
              </button>

              <div className="bg-primary/5 border border-primary/20 px-4 py-2.5 rounded-0">
                <p className="text-primary text-[12px] font-medium uppercase tracking-tighter">
                  {loading
                    ? 'স্ক্যানিং...'
                    : `পাওয়া গেছে: ${pagination?.totalProducts || 0} টি পণ্য`}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <div className="flex grow overflow-hidden gap-5 pt-2">
          <aside className="hidden lg:block w-65 shrink-0 h-full overflow-y-auto no-scrollbar pb-10">
            <nav className="bg-card/40 backdrop-blur-2xl no-scrollbar p-3 rounded-0 border border-border/50 shadow-2xl shadow-primary/5">
              <ShopSidebar {...filterProps} />
            </nav>
          </aside>

          <main
            id="product-feed-container"
            className="grow h-full overflow-y-auto no-scrollbar pb-5"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Skeleton type="product" count={8} />
              </div>
            ) : products?.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product._id} priority={index < 5} product={product} />
                  ))}
                </div>

                {/* প্যাগিনেশন */}
                {pagination?.totalPages > 1 && (
                  <nav className="flex flex-col items-center gap-6 py-5 border-t border-border/10">
                    {/* পৃষ্ঠার সংখ্যা এবং তথ্য */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[12px] font-medium uppercase tracking-wide text-pText/40">
                        সিস্টেম নেভিগেশন
                      </span>
                      <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md px-10 py-4 rounded-0 border border-border/50 shadow-xl shadow-primary/5">
                        <span className="text-xs font-medium tracking-tighter text-text">
                          পৃষ্ঠা <span className="text-primary ml-2">{page}</span>
                        </span>
                        <div className="h-4 w-0.5 bg-border/50" />
                        <span className="text-xs font-medium tracking-tighter text-pText/40">
                          মোট {pagination.totalPages}
                        </span>
                      </div>
                    </div>

                    {/* নেভিগেশন বাটনসমূহ */}
                    <div className="flex items-center gap-4">
                      <button
                        aria-label="Previous Page"
                        disabled={page === 1}
                        onClick={() => handlePagination(page - 1)}
                        className="group flex items-center gap-3 pl-4 pr-6 py-3 bg-card border border-border/50 rounded-0 disabled:opacity-20 hover:border-primary/50 transition-all active:scale-95 disabled:pointer-events-none"
                      >
                        <ChevronLeft
                          size={18}
                          className="text-primary group-hover:-translate-x-1 transition-transform"
                        />
                        <span className="text-[12px] font-medium uppercase tracking-tighter">
                          আগেরটি
                        </span>
                      </button>

                      <button
                        aria-label="Next Page"
                        disabled={page === pagination.totalPages}
                        onClick={() => handlePagination(page + 1)}
                        className="group flex items-center gap-3 pl-6 pr-4 py-3 bg-card border border-border/50 rounded-0 disabled:opacity-20 hover:border-primary/50 transition-all active:scale-95 disabled:pointer-events-none"
                      >
                        <span className="text-[12px] font-medium uppercase tracking-tighter">
                          পরেরটি
                        </span>
                        <ChevronRight
                          size={18}
                          className="text-primary group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </nav>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 bg-card/10 border-2 border-dashed border-border/30 rounded-0">
                <div className="bg-primary/10 p-8 rounded-full mb-6">
                  <Search size={48} className="text-primary opacity-40" />
                </div>
                <h3 className="text-xl font-medium uppercase italic text-pText/40 tracking-tighterer">
                  কোনো পণ্য পাওয়া যায়নি
                </h3>
                <button
                  onClick={() => router.push('/shop')}
                  className="mt-6 text-[12px] font-medium uppercase text-primary border-b border-primary/30 pb-1"
                >
                  সব পণ্য দেখুন
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* মোবাইল ফিল্টার সাইডবার */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-200 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-bg/95 backdrop-blur-md"
            onClick={() => setIsMobileFilterOpen(false)}
          ></motion.div>
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-bg border-r border-border/50 p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-[12px] font-medium uppercase tracking-wide text-primary">
                ফিল্টার অপশন
              </span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-pText">
                <Filter size={18} />
              </button>
            </div>
            <ShopSidebar {...filterProps} />
          </motion.nav>
        </div>
      )}
    </section>
  );
}
