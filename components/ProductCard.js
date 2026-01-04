'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, Star, ShoppingCart, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const basePrice = product?.price?.base || 0;
  const salePrice = product?.price?.discounted || basePrice;
  const discount = product?.offer?.percentage || 0;
  const isOutOfStock = product?.stock <= 0;

  // স্মুথ স্ক্রল ফাংশন
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative w-full transition-all duration-500"
    >
      {/* --- Cyber Background --- */}
      <div className="absolute inset-0 bg-card/40 backdrop-blur-sm border border-border/40 clip-path-cyber rounded-2xl transition-all duration-500 group-hover:border-primary/50 group-hover:bg-card/80 group-hover:-translate-y-1 shadow-xl" />

      <div className="relative z-10 p-2 md:p-4">
        {/* --- Image Area --- */}
        <div className="relative aspect-square overflow-hidden clip-path-cyber-inner bg-bg/50">
          <Link
            href={`/shop/${product?.slug}`}
            onClick={handleScrollToTop}
            className="w-full h-full block"
          >
            <img
              src={product?.images?.[0]?.url || '/placeholder.png'}
              alt={product?.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-primary text-bg text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-sm italic uppercase clip-path-tag">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-xl border transition-all duration-300 z-30
              ${
                isWishlisted
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-bg/40 border-white/10 text-text hover:bg-primary hover:text-bg hover:border-primary'
              }`}
          >
            <Heart size={14} className={isWishlisted ? 'fill-current' : 'fill-none'} />
          </button>

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Link
              href={`/shop/${product?.slug}`}
              onClick={handleScrollToTop}
              className="p-3 bg-bg/90 text-primary rounded-xl translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 shadow-2xl"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>

        {/* --- Product Details --- */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} /> {product?.brand?.name || 'GENERIC'}
            </span>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-primary">
              <Star size={8} className="fill-current" />
              <span className="text-[10px] font-bold">{product?.ratings?.average || 0}</span>
            </div>
          </div>

          <Link href={`/shop/${product?.slug}`} onClick={handleScrollToTop}>
            <h3 className="text-text font-black text-sm md:text-base leading-tight line-clamp-1 uppercase italic tracking-tighter group-hover:text-primary transition-colors">
              {product?.title}
            </h3>
          </Link>

          {/* Price & Cart Section */}
          <div className="pt-3 border-t border-border/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-text text-lg md:text-2xl font-black italic tracking-tighter leading-none">
                ${salePrice}
              </span>
              {discount > 0 && (
                <span className="text-pText text-[10px] line-through font-bold opacity-30">
                  ${basePrice}
                </span>
              )}
            </div>

            <button
              disabled={isOutOfStock}
              className={`p-3 rounded-xl transition-all active:scale-90
                ${
                  isOutOfStock
                    ? 'bg-bg/50 text-pText/30 cursor-not-allowed border border-border/20'
                    : 'bg-primary text-bg shadow-[0_5px_15px_-5px_rgba(41,252,86,0.4)] hover:shadow-primary/40'
                }`}
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Glitch Corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary/40 opacity-0 group-hover:opacity-100 transition-all" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-primary/40 opacity-0 group-hover:opacity-100 transition-all" />

      <style jsx>{`
        .clip-path-cyber {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
        .clip-path-cyber-inner {
          clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
        .clip-path-tag {
          clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
        }
      `}</style>
    </motion.div>
  );
}
