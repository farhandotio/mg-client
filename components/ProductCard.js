'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Optimized Image Component
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ShieldCheck, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAPI, addToCartLocal } from '@/store/features/cartSlice';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const { cartItems } = useSelector((state) => state.cart);

  // useMemo bebohar kora hoyeche jeno bar bar calculation na hoy
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

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    const cartData = {
      productId: product._id,
      title: product.title,
      price: salePrice,
      image: product.images?.[0]?.url || '',
      slug: product.slug,
      quantity: 1,
      stock: product.stock || 50,
    };

    setIsAdding(true);
    try {
      if (user) {
        await dispatch(addToCartAPI({ productId: product._id, quantity: 1 })).unwrap();
      } else {
        dispatch(addToCartLocal(cartData));
      }
    } catch (err) {
      console.error(err);
      if (!err?.message) toast.error('Transmission Interrupted');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative will-change-transform transition-all duration-500 max-w-60 mx-auto"
    >
      {/* Background Cyber Frame */}
      <div className="absolute inset-0 bg-card/70 md:backdrop-blur-2xl border border-bg/5 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:bg-card" />

      <div className="relative z-10 p-3 overflow-hidden">
        {/* Optimized Image Container */}
        <div className="relative aspect-7/5 rounded-xl overflow-hidden bg-bg/50">
          <Link
            href={`/shop/${product?.slug}`}
            onClick={handleScrollToTop}
            className="w-full h-full block relative"
          >
            <Image
              src={product?.images?.[0]?.url || '/placeholder.png'}
              alt={product?.title || 'Product Image'}
              fill
              sizes="(max-width: 768px) 50vw, 240px"
              className="object-cover transition-transform duration-700 md:group-hover:scale-110 grayscale-[0.2] md:group-hover:grayscale-0 will-change-transform"
              loading="lazy"
            />
          </Link>

          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
            {discount > 0 && (
              <span className="bg-primary text-bg text-[8px] md:text-[10px] font-black px-2 py-0.5 italic uppercase rounded-tl-lg rounded-br-lg shadow-md">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-sm uppercase italic">
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} /> {product?.brand?.name || 'GENERIC CORE'}
            </span>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-primary border border-primary/20">
              <Star size={8} className="fill-current" />
              <span className="text-[10px] font-bold">{product?.ratings?.average || 0}</span>
            </div>
          </div>

          <Link href={`/shop/${product?.slug}`} onClick={handleScrollToTop}>
            <h3 className="text-text font-semibold text-sm md:text-lg leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-primary transition-colors">
              {product?.title}
            </h3>
          </Link>

          <div className="pt-3 border-t border-border/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-text text-lg md:text-2xl font-black italic tracking-tighter leading-none">
                ৳{salePrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-pText/40 text-[10px] line-through font-bold">
                  ৳{basePrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              aria-label={isInCart ? 'In Cart' : 'Add to cart'}
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className={`p-2 rounded-lg transition-all active:scale-75 flex items-center justify-center
                ${
                  isOutOfStock
                    ? 'bg-bg/50 text-pText/20 cursor-not-allowed border border-border/10'
                    : isInCart
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-primary text-bg hover:shadow-[0_0_15px_rgba(var(--color-primary),0.4)]'
                }`}
            >
              {isAdding ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ShoppingCart
                  size={18}
                  strokeWidth={2.5}
                  className={isInCart ? 'animate-pulse' : ''}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
