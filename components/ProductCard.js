'use client';
import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  // ডিসকাউন্ট ক্যালকুলেশন
  const discount =
    product?.price?.original > product?.price?.base
      ? Math.round(((product.price.original - product.price.base) / product.price.original) * 100)
      : 0;

  return (
    <div className="group relative w-full bg-card border border-border rounded-2xl p-3 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(41,252,86,0.15)]">
      {/* --- Badges & Wishlist --- */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
        {product?.isNew && (
          <span className="bg-secondary text-text text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="bg-primary text-text text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
            -{discount}%
          </span>
        )}
      </div>

      <button
        className="absolute top-5 right-5 z-20 p-2.5 rounded-2xl bg-bg backdrop-blur-md border border-border text-text hover:bg-primary hover:text-text transition-all duration-300 active:scale-90"
        aria-label="Add to Wishlist"
      >
        <Heart size={18} strokeWidth={2.5} />
      </button>

      {/* --- Image Container & Action Overlay --- */}
      <div className="relative aspect-10/11 overflow-hidden rounded-xl bg-bg flex items-center justify-center">
        <Link
          href={`/shop/${product?._id}`}
          className="w-full h-full flex items-center justify-center p-6"
        >
          <img
            src={product?.image || (product?.images && product.images[0]?.url)}
            alt={product?.title}
            className="w-full h-full object-cover rounded-lg transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Action Overlay: হোভার করলে নিচ থেকে পপ-আপ হবে */}
        <div className="absolute inset-0 bg-text/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8 gap-3">
          <button
            className="translate-y-10 group-hover:translate-y-0 bg-primary p-4 rounded-2xl text-text hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_10px_20px_-5px_rgba(41,252,86,0.5)]"
            title="Add to Cart"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
          </button>

          <Link
            href={`/shop/${product?._id}`}
            className="translate-y-10 group-hover:translate-y-0 bg-bg p-4 rounded-2xl text-text hover:scale-110 active:scale-95 transition-all duration-500 delay-75 shadow-xl"
            title="Quick View"
          >
            <Eye size={22} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* --- Product Details --- */}
      <div className="mt-5 px-2 pb-2">
        <Link href={`/shop/${product?._id}`} className="block group/title">
          <p className="text-pText text-[10px] font-black uppercase tracking-[0.15em] mb-1">
            {product?.brand} • {product?.category}
          </p>
          <h3 className="text-text font-bold text-lg leading-tight group-hover/title:text-primary transition-colors line-clamp-1">
            {product?.title}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center bg-primary/5 border border-primary/10 px-2 py-1 rounded-lg">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-text text-xs font-bold ml-1.5">{product?.rating || 4.5}</span>
          </div>
          <span className="text-pText text-xs font-medium">
            ({product?.numReviews || 0} Reviews)
          </span>
        </div>

        {/* Price & Stock Status */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <div className="flex flex-col">
            {product?.price?.original > product?.price?.base && (
              <span className="text-pText text-xs line-through font-bold mb-0.5">
                ${product.price.original}
              </span>
            )}
            <span className="text-text text-2xl font-black tracking-tight">
              ${product?.price?.base}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-border">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(41,252,86,0.8)] animate-pulse"></div>
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
