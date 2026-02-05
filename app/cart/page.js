'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  removeFromCartAPI,
  updateCartQuantityAPI,
  removeFromCartLocal,
  updateQuantityLocal,
  fetchCart,
} from '@/store/features/cartSlice';
import OrderSummary from './OrderSummary';
import { toast } from 'react-hot-toast';

const InternalCartItem = React.memo(({ item, onUpdate, onRemove, isProcessing }) => {
  const currentPrice = Number(item?.price || 0);
  const currentQty = Number(item?.quantity || 1);
  const stockLimit = Number(item?.stock || 50);

  return (
    <div
      className={`relative transition-all ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-center gap-4 bg-card/20 backdrop-blur-md border border-border/40 rounded-md p-3 hover:border-primary/40 transition-colors shadow-sm">
        {/* অপ্টিমাইজড ইমেজ বক্স - সাইজ কমানো হয়েছে */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-bg/50 rounded-md overflow-hidden border border-border/20">
          <img
            src={item?.image || '/placeholder.png'}
            alt={item?.title}
            loading="lazy"
            className="w-full h-full object-contain rounded-md transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* তথ্য ও বিবরণ - আরও কম্প্যাক্ট */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="truncate pr-4">
              <h3 className="text-sm md:text-base font-bold text-text truncate group-hover:text-primary transition-colors">
                {item?.title}
              </h3>
              <p className="text-[12px] text-pText/50 uppercase font-black tracking-tighterer">
                {item?.brand || 'Premium Gear'}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.productId)}
              className="p-2 text-pText/40 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex justify-between items-center">
            {/* ছোট সাইজের কোয়ান্টিটি কন্ট্রোল */}
            <div className="flex items-center bg-bg/40 border border-border/20 rounded-md p-0.5">
              <button
                onClick={() => onUpdate(item.productId, -1)}
                className="w-7 h-7 flex items-center justify-center text-pText hover:text-primary transition-colors disabled:opacity-30"
                disabled={isProcessing}
              >
                <Minus size={14} />
              </button>
              <div className="w-8 text-center">
                {isProcessing ? (
                  <Loader2 size={12} className="animate-spin text-primary mx-auto" />
                ) : (
                  <span className="text-sm font-bold text-text">{item.quantity}</span>
                )}
              </div>
              <button
                onClick={() => onUpdate(item.productId, 1)}
                className="w-7 h-7 flex items-center justify-center text-pText hover:text-primary transition-colors disabled:opacity-30"
                disabled={currentQty >= stockLimit || isProcessing}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* আধুনিক মূল্য প্রদর্শন */}
            <div className="text-right">
              <p className="text-base md:text-xl font-black text-primary tracking-tighterer">
                ৳{(currentPrice * currentQty).toLocaleString()}
              </p>
              <p className="text-[11px] text-pText/40 font-bold">
                ৳{currentPrice.toLocaleString()}/প্রতিটি
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InternalCartItem.displayName = 'InternalCartItem';

export default function CartPage() {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const { cartItems, loading } = useSelector((state) => state.cart, shallowEqual);
  const { user } = useSelector((state) => state.auth || {}, shallowEqual);

  useEffect(() => {
    setMounted(true);
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const removeItem = useCallback(
    async (productId) => {
      const cleanId = String(productId);
      setProcessingId(cleanId);
      try {
        if (user) await dispatch(removeFromCartAPI(cleanId)).unwrap();
        else dispatch(removeFromCartLocal(cleanId));
        toast.success('কার্ট আপডেট করা হয়েছে');
      } catch (err) {
        toast.error('সমস্যা হয়েছে');
      } finally {
        setProcessingId(null);
      }
    },
    [user, dispatch]
  );

  const updateQuantity = useCallback(
    async (productId, delta) => {
      const cleanId = String(productId);
      const currentItem = cartItems.find((item) => String(item.productId) === cleanId);
      if (!currentItem || processingId) return;

      if (delta === -1 && Number(currentItem.quantity) <= 1) return removeItem(cleanId);

      setProcessingId(cleanId);
      try {
        if (user) {
          await dispatch(
            updateCartQuantityAPI({
              productId: cleanId,
              action: delta > 0 ? 'increase' : 'decrease',
              sessionId: localStorage.getItem('sessionId'),
            })
          ).unwrap();
        } else {
          dispatch(updateQuantityLocal({ productId: cleanId, delta }));
        }
      } catch (err) {
        toast.error('ব্যর্থ হয়েছে');
      } finally {
        setProcessingId(null);
      }
    },
    [cartItems, user, dispatch, processingId, removeItem]
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {/* ছোট ও পরিচ্ছন্ন হেডার */}
        <header className="flex items-center justify-between mb-8 border-b border-border/20 pb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="p-2 bg-card/40 rounded-full hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl md:text-3xl font-black text-text tracking-tighterer uppercase italic">
              শপিং <span className="text-primary">ব্যাগ</span>
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[12px] font-bold text-pText/40 uppercase tracking-tighter block">
              আইটেম সংখ্যা
            </span>
            <span className="text-sm font-black text-primary">{cartItems.length} টি</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* কার্ট আইটেম লিস্ট - ৩ ভাগের ২ ভাগ জায়গা নিবে */}
          <div className="lg:col-span-8 space-y-4">
            {loading && cartItems.length === 0 ? (
              <div className="py-20 flex flex-col items-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <InternalCartItem
                  key={item.productId}
                  item={item}
                  isProcessing={processingId === String(item.productId)}
                  onUpdate={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border/20 rounded-md">
                <ShoppingBag size={48} className="mx-auto text-pText/10 mb-4" />
                <p className="text-sm font-bold text-pText/40 mb-6">আপনার ব্যাগটি খালি!</p>
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-bg font-black px-8 py-3 rounded-md text-sm transition-transform hover:scale-105"
                >
                  কেনাকাটা শুরু করুন
                </Link>
              </div>
            )}
          </div>

          {/* অর্ডার সামারি - ডান পাশে ফিক্সড থাকবে */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <OrderSummary subtotal={subtotal} />
          </div>
        </div>
      </div>
    </section>
  );
}
