'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, ArrowLeft, Trash2, Plus, Minus, Hash } from 'lucide-react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  removeFromCartAPI,
  updateCartQuantityAPI, // নতুন থাঙ্ক ইমপোর্ট করা হলো
  removeFromCartLocal,
  updateQuantityLocal,
  fetchCart,
} from '@/store/features/cartSlice';
import OrderSummary from './OrderSummary';
import { toast } from 'react-hot-toast';

// --- Internal CartItem Component ---
const InternalCartItem = React.memo(({ item, onUpdate, onRemove, isProcessing }) => {
  const currentPrice = Number(item?.price || 0);
  const currentQty = Number(item?.quantity || 1);
  const stockLimit = Number(item?.stock || 50);

  return (
    <div
      className={`group relative mb-6 transition-opacity duration-300 ${
        isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute -left-2 top-10 bottom-10 w-1 bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(41,252,86,0.5)]" />

      <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 bg-card/10 backdrop-blur-xl border border-border/40 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl p-4 md:p-6 transition-all duration-500 hover:border-primary/40 shadow-2xl">
        {/* ইমেজ সেকশন */}
        <div className="relative w-full md:w-44 h-44 shrink-0 flex justify-center items-center mx-auto md:mx-0">
          <div className="relative w-full h-full overflow-hidden clip-path-polygon border border-border/50 bg-bg/80">
            <img
              src={item?.image || '/placeholder.png'}
              alt={item?.title}
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-700 brightness-90 group-hover:brightness-110"
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
        </div>

        {/* কন্টেন্ট সেকশন */}
        <div className="flex-1 flex flex-col justify-between py-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
                <Hash size={10} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                  Unit_{item?.brand || 'Neural'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-text italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {item?.title}
              </h3>
            </div>

            <button
              onClick={() => onRemove(item.productId)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border/40 text-pText/60 hover:text-red-500 hover:border-red-500 transition-all active:scale-90 bg-white/5 hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 mt-6">
            <div className="flex items-center gap-1 bg-bg/50 border border-white/5 rounded-full p-1 shadow-inner group-hover:border-primary/20 transition-colors">
              <button
                onClick={() => onUpdate(item.productId, -1)}
                className="w-10 h-10 flex items-center justify-center text-pText hover:text-primary transition-colors disabled:opacity-30"
                disabled={isProcessing}
              >
                <Minus size={14} />
              </button>
              <div className="px-5 flex flex-col items-center select-none min-w-17.5">
                {isProcessing ? (
                  <Loader2 size={12} className="animate-spin text-primary" />
                ) : (
                  <>
                    <span className="text-[8px] font-black text-pText/30 uppercase tracking-tighter">
                      Payload
                    </span>
                    <span className="text-base md:text-xl font-black font-mono text-text">
                      {String(currentQty).padStart(2, '0')}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => onUpdate(item.productId, 1)}
                className="w-10 h-10 flex items-center justify-center text-pText hover:text-primary transition-colors"
                disabled={currentQty >= stockLimit || isProcessing}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">
                Rate: ৳{currentPrice.toLocaleString()}
              </span>
              <p className="text-2xl md:text-4xl font-black text-text italic tracking-tighter leading-none">
                ৳{(currentPrice * currentQty).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InternalCartItem.displayName = 'InternalCartItem';

// --- Main CartPage ---
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
      if (!cleanId) return;

      setProcessingId(cleanId);
      const loadingToast = toast.loading('Decommissioning unit...');

      try {
        if (user) {
          await dispatch(removeFromCartAPI(cleanId)).unwrap();
        } else {
          dispatch(removeFromCartLocal(cleanId));
        }
        toast.success('Unit removed', { id: loadingToast });
      } catch (err) {
        toast.error('Removal failed', { id: loadingToast });
      } finally {
        setProcessingId(null);
      }
    },
    [user, dispatch]
  );

  const updateQuantity = useCallback(
    async (productId, delta) => {
      const cleanId = String(productId);
      if (!cleanId || processingId) return;

      const currentItem = cartItems.find((item) => String(item.productId) === cleanId);
      if (!currentItem) return;

      // মাইনাস বাটনের জন্য ১ এর নিচে গেলে রিমুভ হবে
      if (delta === -1 && Number(currentItem.quantity) <= 1) {
        return removeItem(cleanId);
      }

      setProcessingId(cleanId);
      try {
        if (user) {
          // ব্যাকএন্ডের নতুন লজিক অনুযায়ী 'increase' বা 'decrease' পাঠানো হচ্ছে
          const actionType = delta > 0 ? 'increase' : 'decrease';
          const sessionId = localStorage.getItem('sessionId');

          await dispatch(
            updateCartQuantityAPI({
              productId: cleanId,
              action: actionType,
              sessionId,
            })
          ).unwrap();
        } else {
          dispatch(updateQuantityLocal({ productId: cleanId, delta }));
        }
      } catch (err) {
        toast.error(err?.message || 'Sync Failed');
      } finally {
        setProcessingId(null);
      }
    },
    [cartItems, user, dispatch, processingId, removeItem]
  );

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-bg py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic">
              Storage <span className="text-primary">[</span>Bay
              <span className="text-primary">]</span>
            </h1>
            <p className="text-pText/50 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  user ? 'bg-primary animate-pulse' : 'bg-yellow-500'
                }`}
              />
              Sector: {user ? 'Cloud Sync Mode' : 'Local Buffer Mode'}
            </p>
          </div>
          <Link
            href="/shop"
            className="mx-auto md:mx-0 text-[10px] font-black uppercase text-primary hover:text-white flex items-center gap-2 transition-all group border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/10"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />{' '}
            Continue Looting
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 w-full">
            {loading && cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 border border-border/10 rounded-3xl bg-card/5 backdrop-blur-md">
                <Loader2 className="text-primary animate-spin mb-4" size={40} />
                <span className="text-[10px] font-black tracking-[0.3em] opacity-50">
                  ACCESSING DATA BANK...
                </span>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <InternalCartItem
                    key={item.productId}
                    item={item}
                    isProcessing={processingId === item.productId}
                    onUpdate={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-border/20 rounded-[3rem] bg-card/5">
                <ShoppingBag size={64} className="mx-auto text-pText/5 mb-8" />
                <p className="text-pText italic uppercase font-black tracking-[0.2em] mb-8 opacity-40">
                  Your bay is empty
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-bg font-black uppercase text-[10px] tracking-[0.2em] px-10 py-5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(41,252,86,0.4)]"
                >
                  Return to Armory
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 w-full sticky top-24">
            <OrderSummary subtotal={subtotal} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-path-polygon {
          clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
        }
      `}</style>
    </section>
  );
}
