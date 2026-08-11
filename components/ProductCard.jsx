'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAPI, addToCartLocal } from '@/store/features/cartSlice';

export default function ProductCard({ product, priority = false }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart.cartItems || []);

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
    <div className="group relative w-full flex flex-col font-sans">
      {/* 1. Image Container with Rounded Corners & Soft Background */}
      <div className="relative aspect-4/4 w-full rounded-2xl overflow-hidden flex items-center justify-center">
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {product?.badge ? (
            <span
              className={`text-[11px] font-medium px-3 py-1 rounded-md text-white ${
                product.badge.toLowerCase() === 'new!'
                  ? 'bg-danger'
                  : product.badge.toLowerCase() === 'best seller'
                    ? 'bg-primary'
                    : 'bg-text/80 text-white'
              }`}
            >
              {product.badge}
            </span>
          ) : discount > 0 ? (
            <span className="bg-danger text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
              -{discount}%
            </span>
          ) : null}

          {isOutOfStock && (
            <span className="bg-bg text-text text-[10px] font-medium px-2.5 py-1 rounded-md uppercase">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={`/shop/${product?.slug}`}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Image
            src={product?.images?.[0]?.url || '/placeholder.png'}
            alt={product?.title || 'Product Image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            draggable={false}
          />
        </Link>

        {/* Hover "Shop Now" / "Add to Cart" Pill Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={`/shop/${product?.slug}`}
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-black text-white text-xs font-medium px-5 py-3 rounded-full shadow-lg hover:bg-white hover:text-black transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            {isAdding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <span>{isInCart ? 'In Bag' : 'Shop Now'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </Link>
        </div>
      </div>

      {/* 2. Bottom Meta / Title, Category & Price Grid */}
      <div className="pt-4 px-1 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          {/* Title */}
          <Link href={`/shop/${product?.slug}`}>
            <h3 className="text-text font-medium text-base leading-snug hover:opacity-75 transition-opacity line-clamp-1">
              {product?.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-1.5 text-text font-medium text-base whitespace-nowrap">
            {discount > 0 && (
              <span className="text-pText text-xs line-through font-normal">
                ৳{basePrice.toLocaleString()}
              </span>
            )}
            <span>৳{salePrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Category / Subtitle */}
        <p className="text-pText text-xs font-medium line-clamp-1">
          {product?.category?.name || product?.subtitle || 'Headphone'}
        </p>

        {/* Color Swatches (if available) */}
        {product?.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((color, index) => (
              <span
                key={index}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
