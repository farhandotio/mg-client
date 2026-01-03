'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, resetProductState } from '@/store/features/productSlice';
import debounce from 'lodash.debounce';

export default function SearchOverlay({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // Redux থেকে সার্চ রেজাল্ট এবং লোডিং স্টেট নিয়ে আসা
  const { products, loading } = useSelector((state) => state.products);

  const executeSearch = useCallback(
    debounce((query) => {
      if (query.trim().length > 0) {
        dispatch(fetchAllProducts(`search=${query}`));
      }
    }, 500),
    [dispatch]
  );

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    executeSearch(value);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      dispatch(resetProductState());
    }
  }, [isOpen, dispatch]);

  const suggestions = ['iPhone 15', 'MacBook', 'Headphones', 'Gaming'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-250 bg-bg/95 backdrop-blur-2xl p-4 md:p-10 overflow-hidden"
        >
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* --- Header & Close --- */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Smart Search
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Search Input Section --- */}
            <div className="relative mb-10">
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="What are you looking for?"
                className="w-full bg-card/50 border-2 border-border/50 focus:border-primary rounded-2xl py-8 px-10 outline-none text-2xl font-black italic tracking-tighter shadow-2xl transition-all"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-primary">
                {loading ? <Loader2 className="animate-spin" size={28} /> : <Search size={28} />}
              </div>
            </div>

            {/* --- Search Results Area --- */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
              {/* Popular Suggestions (যখন কিছু টাইপ করা হয়নি) */}
              {!searchTerm && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-pText text-[10px] font-black uppercase tracking-widest opacity-50 px-2">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearchTerm(item);
                          executeSearch(item);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border/50 rounded-xl text-sm font-bold hover:border-primary/50 transition-all"
                      >
                        {item} <ArrowUpRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Grid (যখন রেজাল্ট থাকবে) */}
              {searchTerm && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product, index) => (
                    <Link key={product._id} href={`/shop/${product.slug}`} onClick={onClose}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-5 p-4 bg-card/40 border border-border/50 rounded-2xl hover:border-primary/30 transition-all group"
                      >
                        <div className="w-16 h-16 bg-bg rounded-xl flex items-center justify-center p-2 shrink-0">
                          <img
                            src={product.images?.[0]?.url || '/placeholder.png'}
                            alt={product.title}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-text text-md truncate group-hover:text-primary transition-colors uppercase italic">
                            {product.title}
                          </h4>
                          <p className="text-[10px] font-black text-pText/60 uppercase tracking-widest">
                            {product.category?.name || 'Gadget'}
                          </p>
                          <div className="text-primary font-black text-sm mt-1">
                            ${product.price?.base}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results State */}
              {searchTerm && !loading && products.length === 0 && (
                <div className="text-center py-20 bg-card/20 rounded-[3rem] border-2 border-dashed border-border/50">
                  <p className="text-pText font-black italic">
                    No gadgets found for "{searchTerm}"
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
