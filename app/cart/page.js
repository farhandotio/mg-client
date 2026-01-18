'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, ArrowLeft, Trash2, Plus, Minus, Hash } from 'lucide-react';
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

// --- Internal CartItem Component ---
const InternalCartItem = React.memo(({ item, onUpdate, onRemove, isProcessing }) => {
  const currentPrice = Number(item?.price || 0);
  const currentQty = Number(item?.quantity || 1);
  const stockLimit = Number(item?.stock || 50);

  return (
    <div
      className={`group relative mb-4 md:mb-6 transition-all duration-300 ${
        isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative Line - Desktop Only */}
      <div className="hidden md:block absolute -left-2 top-8 bottom-8 w-1 bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(41,252,86,0.3)]" />

      <div className="relative flex items-center gap-3 md:gap-8 bg-card/10 backdrop-blur-xl border border-border/40 rounded-2xl md:rounded-tr-[3rem] md:rounded-bl-[3rem] p-3 md:p-6 transition-all duration-500 hover:border-primary/30 shadow-xl">
        {/* Image Section - Optimized for small screens */}
        <div className="relative w-20 h-20 md:w-40 md:h-36 shrink-0">
          <div className="w-full h-full overflow-hidden rounded-xl md:clip-path-polygon border border-border/30 bg-bg/80">
            <img
              src={item?.image || '/placeholder.png'}
              alt={item?.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-0.5 md:space-y-1 truncate">
              <div className="flex items-center gap-1.5 text-primary">
                <Hash size={8} className="animate-pulse hidden md:block" />
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                  {item?.brand || 'Neural'}
                </span>
              </div>
              <h3 className="text-xs md:text-xl font-black text-text italic tracking-tighter leading-tight group-hover:text-primary transition-colors truncate md:whitespace-normal md:line-clamp-1">
                {item?.title}
              </h3>
            </div>

            <button
              aria-label="remove-item"
              onClick={() => onRemove(item.productId)}
              className="shrink-0 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-border/20 text-pText/40 hover:text-red-500 hover:border-red-500 transition-all bg-white/5"
            >
              <Trash2 size={12} className="md:size-4" />
            </button>
          </div>

          <div className="flex justify-between items-center mt-3 md:mt-6">
            {/* Quantity Controller - Compact on mobile */}
            <div className="flex items-center bg-bg/40 border border-white/5 rounded-lg md:rounded-full p-0.5">
              <button
                aria-label="update-item"
                onClick={() => onUpdate(item.productId, -1)}
                className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-pText hover:text-primary transition-colors"
                disabled={isProcessing}
              >
                <Minus size={10} />
              </button>

              <div className="px-2 md:px-4 flex flex-col items-center min-w-28.5 md:min-w-12.5">
                {isProcessing ? (
                  <Loader2 size={10} className="animate-spin text-primary" />
                ) : (
                  <span className="text-xs md:text-lg font-black font-mono text-text">
                    {item.quantity}
                  </span>
                )}
              </div>

              <button
                aria-label="update-item"
                onClick={() => onUpdate(item.productId, 1)}
                className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-pText hover:text-primary transition-colors"
                disabled={currentQty >= stockLimit || isProcessing}
              >
                <Plus size={10} />
              </button>
            </div>

            {/* Price Display */}
            <div className="text-right">
              <p className="text-sm md:text-3xl font-black text-text italic tracking-tighter leading-none">
                ৳{(currentPrice * currentQty).toLocaleString()}
              </p>
              <span className="hidden md:block text-[9px] font-black text-primary/50 uppercase">
                Unit: ৳{currentPrice.toLocaleString()}
              </span>
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
      const loadingToast = toast.loading('Removing unit...');
      try {
        if (user) await dispatch(removeFromCartAPI(cleanId)).unwrap();
        else dispatch(removeFromCartLocal(cleanId));
        toast.success('Unit removed', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to remove', { id: loadingToast });
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
        toast.error(err?.message || 'Update failed');
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
    <section className="min-h-screen bg-bg pt-6 pb-20 md:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header - Compact for Mobile */}
        <header className="mb-8 md:mb-12 flex items-end justify-between border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl md:text-6xl font-black text-text tracking-tighter uppercase italic">
              Storage <span className="text-primary">Bay</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  user ? 'bg-primary animate-pulse' : 'bg-yellow-500'
                }`}
              />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-pText/40">
                {user ? 'Cloud Sync Active' : 'Offline Buffer'}
              </span>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-[9px] md:text-[10px] font-black uppercase text-primary flex items-center gap-1.5 md:gap-2"
          >
            <ArrowLeft size={12} /> <span className="hidden sm:inline">Back to Shop</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-2">
            {loading && cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-card/5 rounded-3xl border border-border/10">
                <Loader2 className="text-primary animate-spin mb-3" size={30} />
                <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">
                  Syncing...
                </span>
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
              <div className="py-20 text-center border border-dashed border-border/20 rounded-3xl bg-card/5">
                <ShoppingBag size={48} className="mx-auto text-pText/10 mb-6" />
                <p className="text-xs font-black uppercase tracking-widest text-pText/40 mb-6">
                  Bay is Empty
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-bg font-black uppercase text-[10px] px-8 py-4 rounded-xl"
                >
                  Armory
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1 sticky bottom-0 md:static md:top-24 z-50 md:z-auto bg-bg md:bg-transparent pt-4 md:pt-0">
            <OrderSummary subtotal={subtotal} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-path-polygon {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
        }
      `}</style>
    </section>
  );
}
