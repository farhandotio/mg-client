'use client';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '@/store/features/categorySlice';
import { Zap, Activity, ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Category() {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const isInitialMount = useRef(true);

  const { categories, loading, isFetched } = useSelector((state) => state.categories);

  useEffect(() => {
    if (loading || isFetched || (categories && categories.length > 0)) return;
    if (isInitialMount.current) {
      dispatch(fetchCategories());
      isInitialMount.current = false;
    }
  }, [dispatch, loading, isFetched, categories]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="pb-12 pt-16 bg-bg relative overflow-hidden border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* আলিবাবা স্টাইল হেডার */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <ShoppingBag aria-label="View Shopping Cart" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-text tracking-tight leading-none">
                ক্যাটাগরি <span className="text-primary">অনুসারে খুঁজুন</span>
              </h2>
              <p className="text-[11px] md:text-xs text-pText font-bold uppercase mt-1 tracking-wider opacity-70">
                আপনার পছন্দের পণ্যটি দ্রুত খুঁজে নিন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              aria-label="View All Categories"
              href="/shop"
              onClick={handleScrollToTop}
              className="group hidden sm:flex items-center gap-2 text-[12px] font-bold text-primary hover:underline transition-all"
            >
              সব দেখুন
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex gap-1.5">
              <button
                aria-label="Scroll Categories Left"
                onClick={() => scroll('left')}
                className="p-2 bg-card border border-border/50 rounded-full hover:bg-primary hover:text-bg transition-all active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Scroll Categories Right"
                onClick={() => scroll('right')}
                className="p-2 bg-card border border-border/50 rounded-full hover:bg-primary hover:text-bg transition-all active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Scroll Area */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-4 scroll-smooth snap-x snap-mandatory"
        >
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="shrink-0 h-32 w-64">
                <Skeleton type="category" className="w-full h-full rounded-md" />
              </div>
            ))
          ) : categories && categories.length > 0 ? (
            categories.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0.5 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="shrink-0 max-w-75 snap-start"
              >
                <Link
                  aria-label={`search through category ${item.name}`}
                  href={`/shop?category=${item.slug}`}
                  onClick={handleScrollToTop}
                  className="group relative block"
                >
                  <div className="relative w-full bg-card border border-border/40 rounded-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 flex items-center p-5 pr-7 gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-bg shrink-0 border border-border/20">
                      <Image
                        src={item.image?.url || '/api/placeholder/400/300'}
                        alt={item.name}
                        fill
                        sizes="100px"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                        quality={75}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-md font-black text-text group-hover:text-primary transition-colors leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[12px] text-pText mt-1 font-bold">কালেকশন দেখুন</p>

                      <div className="mt-3 flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[11px] font-black uppercase">বিস্তারিত</span>
                        <ArrowRight size={10} />
                      </div>
                    </div>

                    <Zap
                      size={50}
                      className="absolute -right-2 -bottom-2 text-primary/5 group-hover:text-primary/10 transition-colors -rotate-12 pointer-events-none"
                    />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="w-full py-10 text-pText italic text-center text-sm">
              বর্তমানে কোনো ক্যাটাগরি পাওয়া যায়নি...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
