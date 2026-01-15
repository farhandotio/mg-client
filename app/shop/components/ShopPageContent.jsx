'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchAllProducts } from '@/store/features/productSlice';
import { fetchCategories } from '@/store/features/categorySlice';
import ProductCard from '@/components/ProductCard';
import ShopSidebar from './ShopSidebar';
import Skeleton from '@/components/Skeleton';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import debounce from 'lodash.debounce';
import Head from 'next/head';

export default function ShopPageContent({ categorySlug }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { products, loading, pagination } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const searchTerm = searchParams.get('search') || '';
  const priceRange = Number(searchParams.get('maxPrice')) || 200000;
  const sortBy = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Find category ID by slug
  const selectedCategory = useMemo(() => {
    if (!categorySlug) return '';
    const found = categories.find((c) => c.slug === categorySlug);
    return found ? found.slug : categorySlug;
  }, [categorySlug, categories]);

  // Update URL helper
  const updateURL = useCallback(
    (paramsObj) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value || value === 0) params.set(key, value);
        else params.delete(key);
      });

      if (selectedCategory)
        router.push(`/shop/category/${selectedCategory}?${params.toString()}`, { scroll: false });
      else router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, selectedCategory]
  );

  // Fetch filtered products
  const fetchFilteredProducts = useCallback(() => {
    const query = new URLSearchParams();
    query.append('page', page);
    query.append('limit', 12);
    query.append('sort', sortBy);
    query.append('price.base[lte]', priceRange);

    if (selectedCategory) query.append('category', selectedCategory);
    if (searchTerm) query.append('search', searchTerm);

    dispatch(fetchAllProducts(query.toString()));
  }, [selectedCategory, priceRange, sortBy, searchTerm, page, dispatch]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [fetchFilteredProducts]);

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
    router.push(selectedCategory ? `/shop/category/${selectedCategory}` : '/shop');
    setIsMobileFilterOpen(false);
  };

  const filterProps = {
    categories,
    searchTerm,
    onSearchChange,
    selectedCategory,
    setPriceRange: (val) => updateURL({ maxPrice: val, page: 1 }),
    priceRange,
    resetFilters,
    setIsMobileFilterOpen,
  };

  return (
    <>
      {/* ================= SEO CONTROL ================= */}
      <Head>
        {selectedCategory ? (
          <>
            <title>{selectedCategory.replace('-', ' ')} Price in Bangladesh | Gadget BDs</title>
            <meta
              name="description"
              content={`Buy ${selectedCategory.replace(
                '-',
                ' '
              )} at best price in Bangladesh from Gadget BDs.`}
            />
            <link
              rel="canonical"
              href={`https://www.gadgetbds.com/shop/category/${selectedCategory}`}
            />
          </>
        ) : (
          <>
            <title>Shop Gadgets Online in Bangladesh | Gadget BDs</title>
            <meta
              name="description"
              content="Buy original gadgets, power banks, networking devices and accessories at best price in Bangladesh from Gadget BDs."
            />
            <link rel="canonical" href="https://www.gadgetbds.com/shop" />
          </>
        )}
      </Head>

      {/* ================= UI ================= */}
      <div className="bg-bg min-h-screen pt-5 pb-20 animate-in fade-in duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-text italic tracking-tighter uppercase leading-none">
                Vault <span className="text-primary">Catalog</span>
              </h1>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-card border border-border px-5 py-3 rounded-lg text-xs font-black uppercase active:scale-95 transition-all"
              >
                <Filter size={14} className="text-primary" /> Filters
              </button>
              <p className="text-pText text-xs px-2 font-black uppercase tracking-widest opacity-80">
                {loading ? 'Scanning...' : `Found ${pagination?.totalProducts || 0} Units`}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-65 shrink-0">
              <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl sticky top-28 ">
                <ShopSidebar {...filterProps} />
              </div>
            </aside>

            {/* Main Grid Content */}
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
                <div className="text-center py-40 rounded-3xl flex flex-col items-center">
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

        {/* Mobile Sidebar */}
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
    </>
  );
}
