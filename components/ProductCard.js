'use client';
import React from 'react';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  // ডিসকাউন্ট ক্যালকুলেশন (যদি ডাটাবেস থেকে না আসে)
  const discount = Math.round(
    ((product?.price?.original - product?.price?.base) / product?.price?.original) * 100
  );

  return (
    <div className="group relative w-full bg-card border border-border rounded-3xl p-3 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_40px_-15px_rgba(41,252,86,0.15)]">
      {/* Badges & Wishlist */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
        {product?.isNew && (
          <span className="bg-secondary text-bg text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="bg-primary text-bg text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      <button className="absolute top-5 right-5 z-10 p-2 rounded-full bg-bg/40 backdrop-blur-md border border-border/50 text-text hover:bg-primary hover:text-bg transition-all duration-300">
        <Heart size={18} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-10/11 overflow-hidden rounded-2xl bg-bg flex items-center justify-center">
        <img
          src={product?.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={product?.title}
          className="w-full h-full object-cover p-4 transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Action Overlay - মাঝখানে পপ-আপ ইফেক্ট */}
        <div className="absolute inset-0 bg-text/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
          <button
            className="translate-y-10 group-hover:translate-y-0 bg-primary p-4 rounded-2xl text-bg hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_10px_20px_-5px_rgba(41,252,86,0.5)]"
            title="Add to Cart"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
          </button>
          <button
            className="translate-y-10 group-hover:translate-y-0 bg-white p-4 rounded-2xl text-black hover:scale-110 active:scale-95 transition-all duration-500 delay-75 shadow-xl"
            title="Quick View"
          >
            <Eye size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-5 px-2 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-pText text-[11px] font-bold uppercase tracking-widest mb-1">
              {product?.brand} • {product?.category}
            </p>
            <h3 className="text-text font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {product?.title}
            </h3>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center bg-secondary/5 px-2 py-1 rounded-lg">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-text text-xs font-bold ml-1">{product?.rating || 0}</span>
          </div>
          <span className="text-pText text-xs">({product?.numReviews || 0} Reviews)</span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex flex-col">
            <span className="text-pText text-xs line-through font-medium">
              ${product?.price?.original}
            </span>
            <span className="text-text text-2xl font-black tracking-tight">
              ${product?.price?.base}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(41,252,86,0.8)] animate-pulse"></div>
              <span className="text-primary text-[10px] font-bold uppercase tracking-tighter">
                In Stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
