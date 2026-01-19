'use client';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '@/store/features/categorySlice';
import { Zap, Activity, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image component
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
    <section className="pb-10 pt-20 bg-bg relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-primary"
            >
              <Activity size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                System_Node: Active_Sectors
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text tracking-tighter uppercase italic leading-none">
              Module <span className="text-primary">Registry</span>
            </h2>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex gap-2">
              <button
                aria-label="Previous categories"
                onClick={() => scroll('left')}
                className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-all active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                aria-label="Next categories"
                onClick={() => scroll('right')}
                className="p-2.5 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-all active:scale-90"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="h-10 w-0.5 bg-bg/10 mx-2 hidden md:block" aria-hidden="true" />
            <Link
              href="/shop"
              onClick={handleScrollToTop}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pText hover:text-primary transition-colors"
            >
              All Units{' '}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* Categories Scroll Area */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar py-8 scroll-smooth snap-x snap-mandatory"
        >
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="shrink-0 h-40 w-75 md:w-95">
                <Skeleton type="category" className="w-full h-full rounded-2xl" />
              </div>
            ))
          ) : categories && categories.length > 0 ? (
            categories.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -50px 0px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="shrink-0 w-75 md:w-95 snap-start"
              >
                <Link
                  href={`/shop?category=${item.slug}`}
                  onClick={handleScrollToTop}
                  className="group relative block h-40"
                >
                  <div className="relative h-full w-full bg-card/50 border border-border/5 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:bg-card/40 flex items-center p-4 gap-6">
                    {/* Image Optimization Container */}
                    <div className="relative w-32 md:w-40 h-full rounded-xl overflow-hidden bg-bg/50 border border-bg/5 shrink-0">
                      <Image
                        src={item.image?.url || '/api/placeholder/400/300'}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 150px, 200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-bg/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/20 backdrop-blur-md rounded-md border border-primary/30 z-10">
                        <span className="text-[8px] font-black text-primary uppercase">
                          Sec_{idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 relative z-10">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-pText/90 uppercase tracking-[0.2em]">
                          Categorical_Node
                        </p>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-text group-hover:text-primary transition-colors italic leading-none">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-px w-8 bg-primary/30 group-hover:w-12 group-hover:bg-primary transition-all duration-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-pText group-hover:text-text transition-colors">
                          Launch
                        </span>
                      </div>
                    </div>

                    <Zap
                      size={80}
                      className="absolute -right-4 -bottom-4 text-bg/20 group-hover:text-primary/5 transition-colors -rotate-12 pointer-events-none"
                    />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="w-full py-10 opacity-20 italic font-black uppercase tracking-widest text-center">
              Scanning for active nodes...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
