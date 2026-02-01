'use client';
import React, { useState, useMemo } from 'react';
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
  const { cartItems } = useSelector((state) => state.cart);

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isOutOfStock || isInCart) return;

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
      toast.success('ব্যাগে যোগ করা হয়েছে');
    } catch (err) {
      toast.error('ব্যর্থ হয়েছে');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      viewport={{ once: true }}
      className="group relative w-full max-w-65 mx-auto bg-card/30 border border-text/5 rounded-2xl p-2 transition-all duration-500 hover:bg-card/50 hover:border-primary/50"
    >
      {/* ইমেজ সেকশন - অপ্টিমাইজড */}
      <div className="relative aspect-10/11 rounded-xl overflow-hidden bg-bg/60 border border-text/5">
        <Link href={`/shop/${product?.slug}`} className="relative w-full h-full block">
          <Image
            src={product?.images?.[0]?.url || '/placeholder.png'}
            alt={product?.title || 'Product Image'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* ব্যাজসমূহ */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {discount > 0 && (
            <div className="bg-primary text-bg text-[12px] font-black px-2 py-1 rounded-tl-xl rounded-br-xl shadow-xl italic">
              -{discount}%
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-red-500/90 backdrop-blur-md text-text text-[11px] font-black px-2 py-1 rounded-lg uppercase">
              আউট অফ স্টক
            </div>
          )}
        </div>

        {/* ডেস্কটপ হোভার বাটন */}
        <div className="absolute inset-x-2 bottom-2 hidden md:flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 z-30">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding || isInCart}
            className={`flex-1 h-10 rounded-xl font-black text-[11px] uppercase tracking-tighter transition-all flex items-center justify-center gap-2
              ${isInCart ? 'bg-green-500 text-bg' : 'bg-primary text-bg'}
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
            className="w-10 h-10 bg-text/10 backdrop-blur-md border border-border/10 text-text rounded-xl flex items-center justify-center hover:bg-primary hover:text-bg transition-all"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* টেক্সট সেকশন */}
      <div className="pt-2 p-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-primary/70 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={10} /> {product?.brand?.name || 'PREMIUM'}
          </span>
          <div className="flex items-center gap-1 text-[12px] font-bold text-yellow-500">
            <Star size={10} className="fill-current" />
            <span>{product?.ratings?.average || 0}</span>
          </div>
        </div>

        <Link href={`/shop/${product?.slug}`}>
          <h3 className="text-text font-bold text-[13px] md:text-[15px] leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product?.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col md:flex-row-reverse md:gap-1 leading-none">
            {discount > 0 && (
              <span className="text-pText/30 text-[12px] line-through font-bold mb-0.5">
                ৳{basePrice.toLocaleString()}
              </span>
            )}
            <span className="text-text text-lg font-black tracking-tighter">
              ৳{salePrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isInCart
                ? 'bg-green-500/20 text-green-500'
                : 'bg-primary text-bg shadow-lg shadow-primary/20'
            }`}
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
    </motion.div>
  );
}
