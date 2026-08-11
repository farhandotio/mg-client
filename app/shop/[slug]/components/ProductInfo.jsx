'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartLocal, addToCartAPI } from '@/store/features/cartSlice';
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function ProductInfo({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const { loading: cartLoading } = useSelector((state) => state.cart);

  const basePrice = product.price?.base || 0;
  const salePrice = product.price?.discounted || basePrice;
  const discountPercent = product.offer?.percentage || 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    setIsLocalLoading(true);
    try {
      if (user) {
        await dispatch(
          addToCartAPI({
            productId: product._id,
            quantity: quantity,
          })
        ).unwrap();
      } else {
        const cartItem = {
          productId: product._id,
          title: product.title,
          price: salePrice,
          image: product.images?.[0]?.url || product.images?.[0] || '/placeholder.png',
          quantity,
          slug: product.slug,
          stock: product.stock,
        };
        dispatch(addToCartLocal(cartItem));
      }
    } catch (err) {
    } finally {
      setIsLocalLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;

    try {
      if (user) {
        await dispatch(
          addToCartAPI({
            productId: product._id,
            quantity: quantity,
          })
        ).unwrap();
      } else {
        const cartItem = {
          productId: product._id,
          title: product.title,
          price: salePrice,
          image: product.images?.[0]?.url || product.images?.[0] || '/placeholder.png',
          quantity,
          slug: product.slug,
          stock: product.stock,
        };
        dispatch(addToCartLocal(cartItem));
      }

      if (!user) {
        toast.success('পণ্যটি কার্টে যোগ করা হয়েছে। অর্ডার সম্পন্ন করতে লগইন করুন।');
        router.push('/auth?redirect=/checkout');
      } else {
        router.push('/checkout');
      }
    } catch (err) {
      toast.error('কার্টে যোগ করতে সমস্যা হয়েছে');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-7 lg:pl-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[12px] font-medium uppercase tracking-tighter rounded-md">
            {product.brand?.name || product.brand}
          </span>
          <span className="px-3 py-1 bg-card border border-border text-pText text-[12px] font-medium uppercase tracking-tighter rounded-md">
            এসকিউ (SKU): {product.sku || 'N/A'}
          </span>
        </div>

        <h1 className="text-3xl font-medium italic tracking-tighterer leading-[1.1] text-text">
          {product.title}
        </h1>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(product.ratings?.average || 0)
                    ? 'fill-primary text-primary'
                    : 'text-border'
                }
              />
            ))}
            <span className="font-medium text-sm ml-1 italic">
              {(product.ratings?.average || 0).toFixed(1)}
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <span className="text-xs font-medium text-pText opacity-50 uppercase tracking-tighter">
            {product.ratings?.count || 0}টি রিভিউ
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-md backdrop-blur-sm w-fit">
        <div className="flex flex-col">
          <span className="text-2xl font-medium text-text italic tracking-tighterer leading-none">
            ৳{salePrice.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-tighter mt-2 ml-1 text-primary">
            বর্তমান বাজার মূল্য
          </span>
        </div>

        {discountPercent > 0 && (
          <div className="flex flex-col border-l border-border/50 pl-6">
            <span className="text-lg text-pText/30 line-through font-medium decoration-primary/40">
              ৳{basePrice.toLocaleString()}
            </span>
            <span className="text-[12px] font-medium text-bg bg-primary px-2 py-0.5 rounded-full mt-1 animate-pulse">
              -{discountPercent}% ছাড়
            </span>
          </div>
        )}
      </div>

      <p className="text-pText/70 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-6 max-w-xl">
        {product.shortDescription ||
          'সেরা পারফরম্যান্স এবং অতুলনীয় স্থায়িত্ব নিশ্চিত করতে এটি বিশেষভাবে তৈরি।'}
      </p>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex justify-between px-5 items-center bg-card border border-border/50 rounded-md p-1 h-14 w-40">
            <button
              aria-label="পরিমাণ কমান"
              disabled={quantity <= 1 || isOutOfStock || isLocalLoading}
              onClick={() => setQuantity((q) => q - 1)}
              className="hover:text-primary transition-all disabled:opacity-20"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            <span className="text-center font-medium text-xl italic min-w-[2ch]">{quantity}</span>
            <button
              aria-label="পরিমাণ বাড়ান"
              disabled={quantity >= (product.stock || 50) || isOutOfStock || isLocalLoading}
              onClick={() => setQuantity((q) => q + 1)}
              className="hover:text-primary transition-all disabled:opacity-20"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 min-w-50">
            <Button
              aria-label="কার্টে যোগ করুন"
              text={isOutOfStock ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}
              icon={isLocalLoading ? Loader2 : ShoppingCart}
              onClick={handleAddToCart}
              loading={isLocalLoading || cartLoading}
              disabled={isOutOfStock || isLocalLoading}
              className={`h-14 rounded-full w-full ${isLocalLoading ? 'animate-pulse' : ''}`}
            />
          </div>
        </div>

        {!isOutOfStock && (
          <Button
            arialabel="সরাসরি কিনুন"
            onClick={handleBuyNow}
            text="সরাসরি অর্ডার করুন (Buy Now)"
            fillColor="bg-success"
            size="lg"
            className="h-14"
          >
            <Zap size={14} className="group-hover:fill-primary" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoBadge icon={<Truck size={20} />} title="দ্রুত ডেলিভারি" desc="২-৪ দিনের মধ্যে" />
        <InfoBadge icon={<ShieldCheck size={20} />} title="নিরাপদ পেমেন্ট" desc="১০০% সুরক্ষিত" />
        <InfoBadge icon={<RotateCcw size={20} />} title="সহজ রিটার্ন" desc="৩০ দিনের মধ্যে" />
      </div>
    </div>
  );
}

function InfoBadge({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-md bg-card/20 border border-border/20 hover:bg-card/40 transition-all group">
      <div className="text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <div className="text-[12px] font-medium uppercase tracking-tighter text-text leading-none">
          {title}
        </div>
        <div className="text-[11px] font-medium text-pText/40 uppercase mt-1">{desc}</div>
      </div>
    </div>
  );
}
