'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowUpRight, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { fetchAllProducts, resetProductState } from '@/store/features/productSlice';
import debounce from 'lodash.debounce';

const SUGGESTIONS = ['iPhone 15', 'MacBook Pro M3', 'Sony XM5', 'Gaming Console'];

export default function SearchOverlay({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // ১. রেডক্স থেকে রিয়েল ডাটা আনা
  const { products, loading } = useSelector(
    (state) => ({
      products: state.products.products || [],
      loading: state.products.loading,
    }),
    shallowEqual
  );

  // ২. রিয়েল টাইম সার্চ ডিবোন্স (৫০০ মিলি-সেকেন্ড পর এপিআই কল হবে)
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        if (query.trim()) {
          // আপনার এপিআই কুয়েরি অনুযায়ী সর্টিং বা ফিল্টারিং যোগ করা হয়েছে
          dispatch(fetchAllProducts(`search=${query}&limit=6&sort=-createdAt` || ''));
        }
      }, 500),
    [dispatch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      debouncedSearch(value);
    } else {
      dispatch(resetProductState());
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      dispatch(resetProductState());
    }
  }, [isOpen, dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-250 bg-bg/95 backdrop-blur-3xl p-4 md:p-10"
        >
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* --- Top Bar --- */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Live Inventory Scan
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Search Box --- */}
            <div className="relative mb-10 group">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search by model, brand or specs..."
                className="w-full bg-card/20 border-b-2 border-border/50 focus:border-primary rounded-t-2xl py-10 px-8 outline-none text-4xl font-black italic tracking-tighter transition-all"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                {loading ? (
                  <Loader2 className="animate-spin text-primary" size={32} />
                ) : (
                  <Search size={32} className="text-pText/20" />
                )}
              </div>
            </div>

            {/* --- Dynamic Results Area --- */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
              {/* Case 1: No Search Query (Show Suggestions) */}
              {!searchTerm && (
                <div className="space-y-8">
                  <p className="text-pText text-[10px] font-black uppercase tracking-widest opacity-40">
                    Trending Now
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearchTerm(item);
                          dispatch(fetchAllProducts(`search=${item}`));
                        }}
                        className="px-8 py-4 bg-card border border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all flex items-center gap-2"
                      >
                        {item} <ArrowUpRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Case 2: Results Found */}
              {searchTerm && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product, idx) => (
                    <Link key={product._id} href={`/shop/${product.slug}`} onClick={onClose}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-card/40 border border-border/30 rounded-3xl hover:bg-card hover:border-primary/50 transition-all flex gap-5 group"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-bg rounded-2xl p-3 flex items-center justify-center border border-border/20 shrink-0">
                          <img
                            src={product.images?.[0]?.url || '/placeholder.png'}
                            alt={product.title}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                            {product.category?.name}
                          </span>
                          <h4 className="text-lg font-black italic uppercase truncate leading-tight tracking-tighter">
                            {product.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xl font-black">${product.price?.base}</span>
                            {product.price?.old && (
                              <span className="text-xs text-pText/40 line-through">
                                ${product.price.old}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                          <ShoppingBag size={20} className="text-primary" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Case 3: Searching (Loading skeleton placeholder if needed) */}
              {loading && products.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-card animate-pulse rounded-3xl" />
                  ))}
                </div>
              )}

              {/* Case 4: Not Found */}
              {searchTerm && !loading && products.length === 0 && (
                <div className="text-center py-20 bg-card/10 rounded-2xl">
                  <h3 className="text-2xl font-black italic uppercase text-pText/40">
                    Zero Results Found
                  </h3>
                  <p className="text-sm mt-2 text-pText/60">
                    Try different keywords or check spelling.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
