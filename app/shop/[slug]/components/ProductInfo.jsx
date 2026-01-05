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
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';

export default function ProductInfo({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLocalLoading, setIsLocalLoading] = useState(false); // বাটন লেভেলে লোডিং দেখানোর জন্য

  // Redux state থেকে ইউজার এবং গ্লোবাল লোডিং চেক
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
        // ফিক্স: API এর জন্য শুধু আইডি এবং কোয়ান্টিটি প্রয়োজন
        await dispatch(
          addToCartAPI({
            productId: product._id,
            quantity: quantity,
          })
        ).unwrap();
      } else {
        // লোকাল কার্টের জন্য পুরো ডাটা প্রয়োজন
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

      toast.success(`${product.title} deployed to cart!`, {
        style: { background: '#111', color: '#29fc56', border: '1px solid #29fc56' },
        iconTheme: { primary: '#29fc56', secondary: '#111' },
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to sync with neural network');
    } finally {
      setIsLocalLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 lg:pl-4">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
            {product.brand?.name || product.brand}
          </span>
          <span className="px-3 py-1 bg-card border border-border text-pText text-[10px] font-black uppercase tracking-widest rounded-lg">
            SKU: {product.sku || 'N/A'}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] text-text">
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
            <span className="font-black text-sm ml-1 italic">
              {(product.ratings?.average || 0).toFixed(1)}
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <span className="text-xs font-bold text-pText opacity-50 uppercase tracking-widest">
            {product.ratings?.count || 0} Verified Reviews
          </span>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="flex items-center gap-6 p-6 bg-card/40 border border-border/50 rounded-3xl backdrop-blur-sm w-fit">
        <div className="flex flex-col">
          <span className="text-5xl font-black text-text italic tracking-tighter leading-none">
            ৳{salePrice.toLocaleString()}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-2 ml-1 text-primary">
            Live Market Price
          </span>
        </div>

        {discountPercent > 0 && (
          <div className="flex flex-col border-l border-border/50 pl-6">
            <span className="text-xl text-pText/30 line-through font-bold decoration-primary/40">
              ৳{basePrice.toLocaleString()}
            </span>
            <span className="text-[10px] font-black text-bg bg-primary px-3 py-1 rounded-full mt-2 animate-pulse">
              -{discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Brief Description */}
      <p className="text-pText/70 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-6 max-w-xl">
        {product.shortDescription ||
          'Engineered for elite performance and unmatched reliability in every mission.'}
      </p>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Quantity Selector */}
          <div className="flex justify-between px-5 items-center bg-card border border-border rounded-2xl p-1 h-14 w-40">
            <button
              disabled={quantity <= 1 || isOutOfStock || isLocalLoading}
              onClick={() => setQuantity((q) => q - 1)}
              className="hover:text-primary transition-all disabled:opacity-20"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            <span className="text-center font-black text-xl italic min-w-[2ch]">{quantity}</span>
            <button
              disabled={quantity >= (product.stock || 50) || isOutOfStock || isLocalLoading}
              onClick={() => setQuantity((q) => q + 1)}
              className="hover:text-primary transition-all disabled:opacity-20"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="h-14 w-14 flex items-center justify-center bg-card border border-border rounded-full hover:border-red-500/50 transition-all group"
          >
            <Heart
              size={24}
              className={
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-pText group-hover:text-red-500'
              }
            />
          </button>

          {/* Add to Cart Button */}
          <div className="flex-1 min-w-50">
            <Button
              text={isOutOfStock ? 'Out of Stock' : 'Deploy to Cart'}
              icon={isLocalLoading ? Loader2 : ShoppingCart}
              onClick={handleAddToCart}
              loading={isLocalLoading || cartLoading} // Redux loading এবং local loading দুটোর সমন্বয়
              disabled={isOutOfStock || isLocalLoading}
              className={`h-14 rounded-full w-full ${isLocalLoading ? 'animate-pulse' : ''}`}
            />
          </div>
        </div>

        {!isOutOfStock && (
          <button className="w-full h-12 rounded-2xl border-2 border-primary/20 hover:border-primary text-primary text-[10px] font-black uppercase tracking-[0.3em] italic transition-all flex items-center justify-center gap-3 group">
            <Zap size={14} className="group-hover:fill-primary" /> Instant Transmission (Buy Now)
          </button>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border/20">
        <InfoBadge icon={<Truck size={20} />} title="Fast Lane" desc="2-4 Day Delivery" />
        <InfoBadge icon={<ShieldCheck size={20} />} title="Encrypted" desc="Secure Payment" />
        <InfoBadge icon={<RotateCcw size={20} />} title="Fallback" desc="30-Day Returns" />
      </div>
    </div>
  );
}

function InfoBadge({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/20 border border-border/20 hover:bg-card/40 transition-all group">
      <div className="text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-text leading-none">
          {title}
        </div>
        <div className="text-[9px] font-bold text-pText/40 uppercase mt-1">{desc}</div>
      </div>
    </div>
  );
}
