'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

export default function SearchOverlay({ isOpen, onClose, query, setQuery, results }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 bg-bg/95 backdrop-blur-xl p-4 md:p-10"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-end mb-6">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={30} className="text-text" />
              </button>
            </div>

            <div className="relative mb-8">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for gadgets..."
                className="w-full bg-card border-2 border-primary/20 focus:border-primary rounded-3xl py-6 px-8 outline-none text-xl font-medium shadow-2xl transition-all"
              />
              <Search
                className="absolute right-8 top-1/2 -translate-y-1/2 text-primary"
                size={28}
              />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[60vh] no-scrollbar">
              {results.map((product) => (
                <Link key={product._id} href={`/shop/${product._id}`} onClick={onClose}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group"
                  >
                    <div className="w-14 h-14 bg-bg rounded-xl flex items-center justify-center p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-text group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-pText">{product.category}</p>
                    </div>
                    <div className="text-primary font-black">${product.price}</div>
                  </motion.div>
                </Link>
              ))}
              {query && results.length === 0 && (
                <p className="text-center text-pText py-10 font-bold">
                  No products found matching "{query}"
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
