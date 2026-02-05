'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ShieldCheck, Loader2, Check, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAPI, addToCartLocal } from '@/store/features/cartSlice';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product, priority = false }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  // ১. পারফরম্যান্স অপ্টিমাইজেশন: ক্যালকুলেশন মেমোরাইজ করা
  const { basePrice, salePrice, discount, isOutOfStock, isInCart } = useMemo(() => {
    const base = product?.price?.base || 0;
    const discounted = product?.price?.discounted || base;
    return {
      basePrice: base,
      salePrice: discounted,
      discount: product?.offer?.percentage || 0,
      isOutOfStock: product?.stock <= 0,
      isInCart: cartItems.some((item) => item.productId === product._id),
    };
  }, [product, cartItems]);

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock || isInCart || isAdding) return;

      setIsAdding(true);
      try {
        if (user) {
          await dispatch(addToCartAPI({ productId: product._id, quantity: 1 })).unwrap();
        } else {
          dispatch(
            addToCartLocal({
              productId: product._id,
              title: product.title,
              price: salePrice,
              image: product.images?.[0]?.url || '',
              slug: product.slug,
              quantity: 1,
              stock: product.stock || 50,
            })
          );
        }
      } catch (err) {
      } finally {
        setIsAdding(false);
      }
    },
    [product, user, isOutOfStock, isInCart, isAdding, salePrice, dispatch]
  );

  return (
    <div
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }}
      className="group relative w-full max-w-65 mx-auto bg-card/30 border border-border/20 rounded-md p-2 transition-all duration-300 md:hover:bg-card md:hover:border-primary/50"
    >
      <div className="relative aspect-square rounded overflow-hidden bg-bg/60 border border-border/10">
        <Link href={`/shop/${product?.slug}`} className="relative w-full h-full block">
          <Image
            src={product?.images?.[0]?.url || '/placeholder.png'}
            alt={product?.title || 'Product Image'}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 md:group-hover:scale-110"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            draggable={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block" />
        </Link>

        {/* ব্যাজসমূহ */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20 pointer-events-none">
          {discount > 0 && (
            <div className="bg-primary text-bg text-[10px] md:text-[12px] font-black px-2 py-0.5 md:py-1 rounded-tl-lg rounded-br-lg shadow-xl italic">
              -{discount}%
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-red-500/90 backdrop-blur-md text-white text-[9px] md:text-[11px] font-black px-2 py-1 rounded-md uppercase">
              স্টক শেষ
            </div>
          )}
        </div>

        <div className="absolute inset-x-2 bottom-2 hidden md:flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 z-30">
          <button
            aria-label={isInCart ? 'Already in cart' : 'Add to Cart'}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding || isInCart}
            className={`flex-1 h-10 rounded-md font-black text-[11px] uppercase tracking-tighterer transition-all flex items-center justify-center gap-2 shadow-lg
              ${isInCart ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}
              ${isOutOfStock || isAdding ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isAdding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isInCart ? (
              <Check size={14} />
            ) : (
              <ShoppingCart size={14} />
            )}
            {isInCart ? 'কার্টে আছে' : 'ব্যাগে নিন'}
          </button>

          <Link
            href={`/shop/${product?.slug}`}
            aria-label="View Product Details"
            className="w-10 h-10 bg-card/10 backdrop-blur-md border border-card/10 text-text rounded-md flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="pt-2 p-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] md:text-[11px] font-black text-primary/70 uppercase tracking-tighter flex items-center gap-1">
            <ShieldCheck size={10} /> {product?.brand?.name || 'PREMIUM'}
          </span>
          <div className="flex items-center gap-1 text-[11px] md:text-[12px] font-bold text-secondary">
            <Star size={10} className="fill-current" />
            <span>{product?.ratings?.average || 0}</span>
          </div>
        </div>

        <Link href={`/shop/${product?.slug}`}>
          <h3 className="text-text font-bold text-[13px] md:text-[15px] leading-tight line-clamp-1 md:group-hover:text-primary transition-colors">
            {product?.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col md:flex-row-reverse md:items-center md:gap-1.5 leading-none">
            {discount > 0 && (
              <span className="text-pText/50 text-xs md:text-sm line-through font-bold mt-1.5">
                ৳{basePrice.toLocaleString()}
              </span>
            )}
            <span className="text-text text-base md:text-lg font-black tracking-tighterer">
              ৳{salePrice.toLocaleString()}
            </span>
          </div>

          <button
            aria-label="Add to Cart"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding || isInCart}
            className={`md:hidden w-9 h-9 rounded-md flex items-center justify-center transition-all active:scale-90 ${
              isInCart
                ? 'bg-green-500/20 text-green-500'
                : 'bg-primary text-white shadow-md shadow-primary/20'
            } ${isOutOfStock || isAdding ? 'opacity-50' : ''}`}
          >
            {isAdding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isInCart ? (
              <Check size={18} />
            ) : (
              <ShoppingCart size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
