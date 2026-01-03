'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartLocal, addToCartAPI } from '@/store/features/cartSlice';
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import Button from '@/components/Button';

export default function ProductInfo({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.cart);

  // Schema অনুযায়ী ক্যালকুলেটেড প্রাইস
  const basePrice = product.price?.base || 0;
  const salePrice = product.price?.discounted || basePrice;
  const discountPercent = product.offer?.percentage || 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    const cartItem = {
      productId: product._id,
      title: product.title,
      price: salePrice,
      image: product.images?.[0]?.url,
      quantity,
      slug: product.slug,
      stock: product.stock,
    };
    isAuthenticated ? dispatch(addToCartAPI(cartItem)) : dispatch(addToCartLocal(cartItem));
  };

  return (
    <div className="flex flex-col gap-5 md:gap-7 animate-in fade-in slide-in-from-right-10 duration-700">
      {/* 1. Header: Brand & Title */}
      <div className="space-y-2 text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
          <span className="text-primary font-black uppercase tracking-widest text-[9px] bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
            {product.brand?.name || 'Exclusive'}
          </span>
          {product.productType !== 'Regular' && (
            <span className="bg-text text-bg text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
              {product.productType}
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="text-orange-500 font-black text-[9px] uppercase animate-pulse">
              Low Stock: {product.stock} left
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tighter italic text-text">
          {product.title}
        </h1>

        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-black text-xs">
              {product.ratings?.average?.toFixed(1) || '0.0'}
            </span>
          </div>
          <div className="h-1 w-1 rounded-full bg-border" />
          <span className="text-pText text-[10px] font-black uppercase opacity-40">
            {product.ratings?.count || 0} Reviews
          </span>
        </div>
      </div>

      {/* 2. Pricing Section: Schema-based integration */}
      <div className="flex items-center justify-center md:justify-start gap-5 py-4 px-6 bg-card/30 border border-border/40 rounded-3xl backdrop-blur-md w-full md:w-fit">
        <div className="flex flex-col">
          <span className="text-4xl md:text-5xl font-black text-text tracking-tighter italic leading-none">
            ${salePrice}
          </span>
          <span className="text-[9px] font-black uppercase text-pText/40 mt-1">Sale Price</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex flex-col border-l border-border/50 pl-5">
            <span className="text-lg text-pText/40 line-through font-bold decoration-primary/40">
              ${basePrice}
            </span>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
              -{discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      {/* 3. Description: Compacted */}
      <p className="text-pText/80 text-sm md:text-base leading-relaxed border-l-2 border-primary/30 pl-4 italic font-medium max-w-lg text-center md:text-left line-clamp-3">
        {product.shortDescription || product.description}
      </p>

      {/* 4. Actions: Optimized for Mobile */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Quantity and Wishlist Row */}
          <div className="flex gap-2 h-12 md:h-14">
            <div className="flex grow items-center bg-card/80 border border-border rounded-2xl px-1 shadow-inner overflow-hidden">
              <button
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity((q) => q - 1)}
                className="w-10 h-full flex items-center justify-center hover:text-primary transition-colors disabled:opacity-10"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="grow text-center font-black text-lg italic tabular-nums">
                {quantity}
              </span>
              <button
                disabled={quantity >= product.stock || isOutOfStock}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-full flex items-center justify-center hover:text-primary transition-colors disabled:opacity-10"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-12 md:w-14 flex items-center justify-center bg-card border border-border rounded-2xl group transition-all"
            >
              <Heart
                size={20}
                className={`${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-pText'
                } transition-transform group-active:scale-125`}
              />
            </button>
          </div>

          {/* Add to Cart */}
          <div className="grow">
            <Button
              text={isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              icon={ShoppingCart}
              onClick={handleAddToCart}
              loading={loading}
              disabled={isOutOfStock}
              size="xl"
              className="h-12 md:h-14 rounded-2xl"
            />
          </div>
        </div>

        {/* Direct Checkout */}
        {!isOutOfStock && (
          <Button
            text="Buy It Now"
            icon={Zap}
            bgColor="bg-card"
            size="lg"
            className="rounded-2xl border-primary/20 text-primary hover:border-primary transition-all italic tracking-[0.2em] text-xs h-11"
          />
        )}
      </div>

      {/* 5. Premium Value Badges - Redesigned */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 border-t border-border/20">
        <Badge icon={<Truck size={22} />} label="Express Shipping" sub="Delivery in 2-4 days" />
        <Badge
          icon={<ShieldCheck size={22} />}
          label="Secure Warranty"
          sub="1 Year Brand Warranty"
        />
        <Badge icon={<RotateCcw size={22} />} label="Easy Returns" sub="30 Days Return Policy" />
      </div>
    </div>
  );
}

// Compact & Premium Badge Component
function Badge({ icon, label, sub }) {
  return (
    <div className="flex items-center sm:flex-col lg:flex-row gap-4 p-3 rounded-2xl bg-card/20 border border-border/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-500 group">
      {/* Icon Sphere */}
      <div className="w-12 h-12 shrink-0 rounded-xl bg-bg border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-bg transition-all duration-500 shadow-inner">
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-black uppercase tracking-widest text-text leading-tight group-hover:text-primary transition-colors">
          {label}
        </span>
        <span className="text-[9px] font-bold text-pText/40 italic truncate uppercase tracking-tighter mt-0.5">
          {sub}
        </span>
      </div>
    </div>
  );
}
