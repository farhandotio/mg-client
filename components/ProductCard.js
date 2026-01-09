'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, ShieldCheck, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAPI, addToCartLocal } from '@/store/features/cartSlice';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const { cartItems } = useSelector((state) => state.cart);

  const basePrice = product?.price?.base || 0;
  const salePrice = product?.price?.discounted || basePrice;
  const discount = product?.offer?.percentage || 0;
  const isOutOfStock = product?.stock <= 0;

  const isInCart = cartItems.some((item) => item.productId === product._id);

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // --- Cart Handle Function (Core Update) ---
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
      await dispatch(
        addToCartAPI({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();
    } else {
      dispatch(addToCartLocal(cartData));
    }
  } catch (err) {
    console.error(err);
    if (!err?.message) {
      toast.error('Transmission Interrupted');
    }
  } finally {
    setIsAdding(false);
  }
};
  return (
    <motion.div
      initial={{ opacity: 1, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative w-full will-change-transform transition-all duration-500 max-w-60 mx-auto"
    >
      {/* Background Cyber Frame */}
      <div className="absolute inset-0 bg-card/60 md:bg-card/40 md:backdrop-blur-sm border border-border/40 clip-path-cyber rounded-2xl transition-all duration-500 group-hover:border-primary/50 group-hover:bg-card/80 md:group-hover:-translate-y-1 shadow-lg" />

      <div className="relative z-10 p-2 md:p-4">
        {/* Image Container */}
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
              className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110 grayscale-[0.2] md:group-hover:grayscale-0"
            />
          </Link>

          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-primary text-bg text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-sm italic uppercase clip-path-tag shadow-md">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-sm uppercase italic">
                Offline
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full border transition-all duration-300 z-30 active:scale-90
              ${
                isWishlisted
                  ? 'bg-red-500 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'bg-bg/40 border-white/10 text-text hover:bg-red-400 hover:text-bg'
              }`}
          >
            <Heart size={14} className={isWishlisted ? 'fill-current' : 'fill-none'} />
          </button>
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
            <h3 className="text-text font-black text-sm md:text-base leading-tight line-clamp-1 uppercase italic tracking-tighter group-hover:text-primary transition-colors">
              {product?.title}
            </h3>
          </Link>

          {/* Pricing and Action */}
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
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className={`p-3 rounded-xl transition-all active:scale-75 flex items-center justify-center
                ${
                  isOutOfStock
                    ? 'bg-bg/50 text-pText/20 cursor-not-allowed border border-border/10'
                    : isInCart
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-primary text-bg shadow-md md:shadow-[0_5px_15px_-5px_rgba(41,252,86,0.4)]'
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
