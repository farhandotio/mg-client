'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import Button from './Button';

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const basePrice = product?.price?.base || 0;
  const salePrice = product?.price?.discounted || basePrice;
  const discount = product?.offer?.percentage || 0;
  const isOutOfStock = product?.stock <= 0;

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative w-full bg-card border border-border/40 rounded-2xl p-1.5 md:p-3 transition-all duration-500 hover:border-primary/40 md:hover:shadow-[0_20px_40px_-15px_rgba(41,252,86,0.15)]"
    >
      {/* --- Badges --- */}
      <div className="absolute top-2 left-3 z-20">
        {discount > 0 && (
          <span className="bg-primary text-white text-[8px] md:text-[10px] font-black px-1.5 md:px-3 py-0.5 md:py-1 rounded-full shadow-xl uppercase">
            {discount}%
          </span>
        )}
      </div>

      {/* --- Image Container --- */}
      <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-bg flex items-center justify-center">
        <Link href={`/shop/${product?.slug}`} className="w-full h-full">
          <img
            src={product?.images?.[0]?.url || '/placeholder.png'}
            alt={product?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 p-1.5 md:p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-30
            ${
              isWishlisted
                ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-bg/20 border-white/5 text-text hover:text-red-500 hover:border-red-500/30'
            }`}
        >
          <Heart
            size={14}
            className={`md:w-4.5 transition-all duration-300 ${
              isWishlisted ? 'fill-current scale-110' : 'fill-none'
            }`}
          />
        </button>

        {/* --- Action Buttons --- */}
        <div className="absolute bottom-2 md:bottom-3 inset-x-2 md:inset-x-3 flex items-center gap-2 z-20">
          {/* Add to Cart Button */}
          <button
            disabled={isOutOfStock}
            className={`flex-1 h-10 flex items-center justify-center overflow-hidden transition-all duration-300 active:scale-95
      ${
        isOutOfStock
          ? 'bg-bg/50 backdrop-blur-2xl rounded-2xl text-text cursor-not-allowed'
          : 'rounded-2xl text-white bg-primary'
      }`}
          >
            {isOutOfStock ? (
              <div className="relative flex items-center justify-center">
                <ShoppingCart size={18} className="md:w-5 opacity-40" />
                <div className="absolute h-[1.5px] w-full bg-red-500/60 rotate-45 rounded-full" />
              </div>
            ) : (
              <ShoppingCart size={18} className="md:w-5" strokeWidth={2.5} />
            )}
          </button>

          {/* Eye Button (Quick View) */}
          <Link
            href={`/shop/${product?.slug}`}
            className="h-10 w-10 shrink-0 flex items-center justify-center bg-bg/40 backdrop-blur-md rounded-2xl text-text border border-bg/10 hover:bg-bg hover:text-text transition-all duration-300 shadow-lg"
          >
            <Eye size={18} className="md:w-5" />
          </Link>
        </div>
      </div>

      {/* --- Product Details --- */}
      <div className="mt-3 px-1 md:px-2 pb-1 md:pb-2">
        <div className="flex justify-between items-center mb-1">
          <p className="text-pText text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-50 truncate">
            {product?.brand?.name}
          </p>
          <div className="flex items-center gap-0.5 text-primary">
            <Star size={10} className="fill-current" />
            <span className="text-[9px] md:text-[11px] font-black">
              {product?.ratings?.average || 0}
            </span>
          </div>
        </div>

        <Link href={`/shop/${product?.slug}`}>
          <h3 className="text-text font-bold text-sm md:text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product?.title}
          </h3>
        </Link>

        {/* Price & Stock Status */}
        <div className="mt-3 pt-2 border-t border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="text-text text-base md:text-xl font-black italic tracking-tighter">
              ${salePrice}
            </span>
            {discount > 0 && (
              <span className="text-pText text-[9px] md:text-[10px] line-through font-bold opacity-30">
                ${basePrice}
              </span>
            )}
          </div>

          {product?.stock < 5 && product?.stock > 0 ? (
            <span className="text-[8px] text-orange-500 font-bold uppercase italic animate-pulse">
              {product.stock} left
            </span>
          ) : (
            <div className="flex items-center gap-1 opacity-40">
              <Zap size={8} className="text-primary fill-primary" />
              <span className="text-primary text-[8px] font-black uppercase italic">Verified</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
