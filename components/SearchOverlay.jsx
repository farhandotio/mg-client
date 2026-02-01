'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowUpRight, Loader2, Database, Zap } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { fetchAllProducts } from '@/store/features/productSlice';
import debounce from 'lodash.debounce';

export default function SearchOverlay({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { products, loading } = useSelector(
    (state) => ({
      products: state.products.products || [],
      loading: state.products.loading,
    }),
    shallowEqual
  );

  const suggestions = useMemo(() => {
    if (!products.length) return ['আইফোন', 'গেমিং', 'ল্যাপটপ', 'অডিও'];
    const cats = products.map((p) => p.category?.name).filter(Boolean);
    return [...new Set(cats)].slice(0, 4);
  }, [products]);

  useEffect(() => {
    if (isOpen && !searchTerm) {
      dispatch(fetchAllProducts('limit=6&sort=-createdAt'));
    }
  }, [isOpen, dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        if (query.trim()) {
          dispatch(fetchAllProducts(`search=${query}&limit=6`));
        } else {
          dispatch(fetchAllProducts('limit=6&sort=-createdAt'));
        }
      }, 500),
    [dispatch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (val) => {
    setSearchTerm(val);
    dispatch(fetchAllProducts(`search=${val}&limit=6`));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-99999 bg-bg/95 backdrop-blur-3xl p-4 md:p-10"
        >
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* --- Header Section --- */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-primary">
                <Database size={16} className={loading ? 'animate-pulse' : ''} />
                <span className="text-[12px] font-black uppercase tracking-[0.3em]">
                  ইনভেন্টরি সিনক্রোনাইজেশন
                </span>
              </div>
              <button
                aria-label="Close Search Overlay"
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-full transition-colors text-text"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Search Input Area --- */}
            <div className="relative mb-8">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="পণ্য খুঁজুন..."
                className="w-full bg-transparent border-b-2 border-border focus:border-primary py-8 px-2 outline-none text-3xl md:text-5xl font-black italic tracking-tighter transition-all placeholder:text-white/5 text-text"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {loading ? (
                  <Loader2 className="animate-spin text-primary" size={28} />
                ) : (
                  <Search className="text-white/10" size={28} />
                )}
              </div>
            </div>

            {/* --- Quick Suggestions --- */}
            {!searchTerm && (
              <div className="mb-10">
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {suggestions.map((item, idx) => (
                    <button
                      aria-label={`Use Search Suggestion: ${item}`}
                      key={idx}
                      onClick={() => handleSuggestionClick(item)}
                      className="group flex items-center gap-2 px-5 py-2.5 bg-card/30 border border-border/50 rounded-full hover:border-primary/50 transition-all active:scale-95"
                    >
                      <Zap
                        size={12}
                        className="text-primary group-hover:fill-primary transition-all"
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-pText/70 group-hover:text-primary">
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- Search Results --- */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-4 mb-6">
                <p className="text-pText/40 text-[12px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                  {searchTerm ? `"${searchTerm}" এর ফলাফল` : 'নতুন কালেকশন'}
                </p>
                <div className="h-0.5 w-full bg-border/20" />
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${
                  loading ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'
                }`}
              >
                {products.length > 0
                  ? products.map((product, idx) => (
                      <Link
                        aria-label={`View Product: ${product.title}`}
                        key={product._id}
                        href={`/shop/${product.slug}`}
                        onClick={onClose}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="p-3 bg-card/20 border border-border/20 rounded-2xl hover:border-primary/40 transition-all flex gap-4 group"
                        >
                          <div className="w-20 h-20 bg-bg rounded-xl border border-border/10 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={product.images?.[0]?.url || '/placeholder.png'}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <h4 className="text-sm md:text-base font-black italic uppercase truncate tracking-tighter group-hover:text-primary transition-colors text-text">
                              {product.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-lg font-black text-text">
                                ৳{product.price?.discounted || product.price?.base}
                              </span>
                              {product.price?.discounted && (
                                <span className="text-[12px] text-pText/40 line-through">
                                  ৳{product.price.base}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center pr-2">
                            <ArrowUpRight
                              size={16}
                              className="text-pText/20 group-hover:text-primary group-hover:translate-x-1 transition-all"
                            />
                          </div>
                        </motion.div>
                      </Link>
                    ))
                  : !loading && (
                      <div className="col-span-full text-center py-20 opacity-30 italic">
                        <p className="text-pText font-bold uppercase tracking-widest text-sm">
                          কোনো পণ্য পাওয়া যায়নি
                        </p>
                      </div>
                    )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
