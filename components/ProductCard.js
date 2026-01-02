'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const discount =
    product?.price?.original > product?.price?.base
      ? Math.round(((product.price.original - product.price.base) / product.price.original) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative w-full bg-card border border-border rounded-xl md:rounded-2xl p-2.5 md:p-3 transition-all duration-500 hover:border-primary/40 md:hover:shadow-[0_20px_40px_-15px_rgba(41,252,86,0.15)]"
    >
      {/* --- Badges & Wishlist --- */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
        {product?.isNew && (
          <span className="bg-secondary text-text text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="bg-primary text-bg text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
            -{discount}%
          </span>
        )}
      </div>

      <button
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-bg/40 backdrop-blur-md border border-border/50 text-text hover:bg-primary hover:text-bg transition-all duration-300 active:scale-90"
        aria-label="Add to Wishlist"
      >
        <Heart size={18} strokeWidth={2.5} />
      </button>

      {/* --- Image Container --- */}
      <div className="relative aspect-square md:aspect-10/11 overflow-hidden rounded-xl bg-bg flex items-center justify-center">
        <Link href={`/shop/${product?._id}`} className="w-full h-full">
          {/* image cover হিসেবে সেট করা হয়েছে আপনার রিকোয়েস্ট অনুযায়ী */}
          <img
            src={product?.images?.[0]?.url || 'https://via.placeholder.com/300'}
            alt={product?.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Action Buttons: মোবাইলে এটি সব সময় ভিজিবল এবং ক্লিনার লুক */}
        <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-20 w-[90%] md:w-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex-1 md:flex-none bg-primary p-3 md:p-4 rounded-xl md:rounded-2xl text-bg shadow-xl flex items-center justify-center gap-2 hover:bg-[#24e04d] md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="md:hidden text-[10px] font-black uppercase tracking-tighter">Add</span>
          </motion.button>

          <Link
            href={`/shop/${product?._id}`}
            className="hidden md:flex bg-white/90 backdrop-blur-md p-4 rounded-2xl text-black shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 delay-75"
          >
            <Eye size={22} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* --- Product Details --- */}
      <div className="mt-4 md:mt-5 px-1 md:px-2 pb-1">
        <Link href={`/shop/${product?._id}`} className="block space-y-1">
          <p className="text-pText text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            {product?.brand}
          </p>
          <h3 className="text-text font-bold text-sm md:text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {product?.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2 md:mt-3">
          <div className="flex items-center bg-primary/10 px-2 py-0.5 rounded-lg">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-text text-[10px] md:text-sm font-black ml-1">
              {product?.rating || 0}
            </span>
          </div>
          <span className="text-pText text-[10px] md:text-xs font-bold opacity-50 uppercase tracking-tighter">
            {product?.numReviews || 0} Reviews
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-text text-xl md:text-2xl font-black tracking-tight leading-none">
              ${product?.price?.base}
            </span>
            {product?.price?.original && (
              <span className="text-pText text-[10px] md:text-xs line-through font-bold opacity-40 mt-1">
                ${product.price.original}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#29fc56] animate-pulse"></div>
            <span className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
