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
    // শুধুমাত্র প্রোডাক্টের কন্টেইনারটিকে টপে স্ক্রোল করবে
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
    <section className="bg-bg h-[90vh] overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        {/* Fixed Header: স্ক্রোল হবে না */}
        <header className="pb-3 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Globe size={14} className="animate-spin-slow" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  Global_Inventory
                </span>
              </div>
              {/* <h1 className="text-4xl font-black text-text italic tracking-tighter uppercase leading-none">
                Vault{' '}
                <span className="text-primary">
                  {productType || (urlCategory ? urlCategory.replace(/-/g, ' ') : 'Catalog')}
                </span>
              </h1> */}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg text-[10px] font-black uppercase"
              >
                <Filter size={12} className="text-primary" /> Filters
              </button>
              <p className="text-pText text-[10px] font-black uppercase tracking-widest opacity-80">
                {loading ? 'Scanning...' : `Captured: ${pagination?.totalProducts || 0} Units`}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area: এখানে মেইন ম্যাজিক */}
        <div className="flex grow overflow-hidden gap-5 pt-1">
          {/* 1. Sidebar Node: এটি ফিক্সড থাকবে */}
          <aside className="hidden lg:block w-72 shrink-0 h-full overflow-y-auto no-scrollbar pb-10">
            <nav className="bg-card/30 backdrop-blur-xl p-5 rounded-3xl border border-border/50 shadow-2xl shadow-primary/5">
              <ShopSidebar {...filterProps} />
            </nav>
          </aside>

          {/* 2. Product Feed: শুধুমাত্র এটি স্ক্রোল হবে */}
          <main
            id="product-feed-container"
            className="grow h-full overflow-y-auto no-scrollbar pb-20 pr-1"
          >
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <Skeleton type="product" count={8} />
              </div>
            ) : products?.length > 0 ? (
              <div className="space-y-16">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.totalPages > 1 && (
                  <nav className="flex justify-center items-center gap-4 pb-10">
                    <button
                      disabled={page === 1}
                      onClick={() => handlePagination(page - 1)}
                      className="p-4 bg-card border border-border rounded-xl disabled:opacity-20 hover:border-primary transition-all"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-[10px] font-black uppercase bg-card px-6 py-4 rounded-xl border border-border">
                      {page} / {pagination.totalPages}
                    </span>
                    <button
                      disabled={page === pagination.totalPages}
                      onClick={() => handlePagination(page + 1)}
                      className="p-4 bg-card border border-border rounded-xl disabled:opacity-20 hover:border-primary transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </div>
            ) : (
              <div className="text-center py-32 bg-card/10 border border-dashed border-border rounded-3xl">
                <Search size={40} className="text-pText/20 mx-auto mb-6" />
                <h3 className="text-xl font-black uppercase italic text-pText/40">
                  No Units Detected
                </h3>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-bg/95 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <nav className="absolute left-0 top-0 h-full w-[80%] bg-bg border-r border-border p-8 overflow-y-auto">
            <ShopSidebar {...filterProps} />
          </nav>
        </div>
      )}
    </section>
  );
}
