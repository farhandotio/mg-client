'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, ArrowLeft, Trash2, Plus, Minus, Hash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCartAPI,
  addToCartAPI,
  removeFromCartLocal,
  updateQuantityLocal,
  fetchCart,
} from '@/store/features/cartSlice';
import OrderSummary from './OrderSummary';
import { toast } from 'react-hot-toast';

// --- Internal CartItem Component ---
const InternalCartItem = ({ item, onUpdate, onRemove }) => {
  const currentPrice = Number(item?.price || 0);
  const currentQty = Number(item?.quantity || 1);
  const stockLimit = Number(item?.stock || 50);

  return (
    <div className="group relative mb-6">
      <div className="absolute -left-2 top-10 bottom-10 w-1 bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(41,252,86,0.5)]" />

      <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 bg-card/10 backdrop-blur-xl border border-border/40 rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl p-4 md:p-6 transition-all duration-500 hover:border-primary/40">
        <div className="relative w-full md:w-44 h-44 shrink-0">
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

        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Hash size={10} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                  Unit_{item?.brand || 'Neural'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-text italic uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {item?.title}
              </h3>
              <p
                className={`text-[9px] font-bold uppercase tracking-widest italic mt-1 ${
                  currentQty >= stockLimit ? 'text-red-500 animate-pulse' : 'text-primary/50'
                }`}
              >
                {currentQty >= stockLimit
                  ? 'System Capacity: Maximum'
                  : 'Status: Optimal Connection'}
              </p>
            </div>

            <button
              onClick={() => onRemove(item.productId)}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border/40 text-pText/60 hover:text-red-500 hover:border-red-500 transition-all active:scale-90 bg-white/5 hover:bg-red-500/10 shadow-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex flex-wrap justify-between items-end gap-4 mt-6">
            <div className="flex items-center gap-1 bg-bg/50 border border-white/5 rounded-full p-1 shadow-inner group-hover:border-primary/20 transition-colors">
              <button
                onClick={() => onUpdate(item.productId, -1)}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-pText hover:text-primary disabled:opacity-20 transition-colors"
                disabled={currentQty <= 1}
              >
                <Minus size={14} />
              </button>

              <div className="px-3 md:px-5 flex flex-col items-center select-none min-w-[60px]">
                <span className="text-[8px] font-black text-pText/30 uppercase tracking-tighter">
                  Payload
                </span>
                <span className="text-base md:text-xl font-black font-mono text-text">
                  {String(currentQty).padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={() => onUpdate(item.productId, 1)}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-pText hover:text-primary transition-colors disabled:opacity-20"
                disabled={currentQty >= stockLimit}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">
                Unit_Rate: ৳{currentPrice.toLocaleString()}
              </span>
              <p className="text-2xl md:text-4xl font-black text-text italic tracking-tighter leading-none">
                ৳{(currentPrice * currentQty).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .clip-path-polygon {
          clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
};

// --- Main CartPage ---
export default function CartPage() {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const { cartItems = [], loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    setMounted(true);
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const updateQuantity = async (productId, delta) => {
    if (!productId) return;
    const currentItem = cartItems.find((item) => item.productId === productId);
    if (!currentItem) return;
    if (currentItem.quantity + delta < 1) return;

    if (delta > 0 && currentItem.quantity >= (currentItem.stock || 50)) {
      toast.error('System Limit: Hardware Stock Exhausted');
      return;
    }

    try {
      if (user) {
        await dispatch(addToCartAPI({ productId, quantity: delta })).unwrap();
      } else {
        dispatch(updateQuantityLocal({ productId, delta }));
      }
    } catch (err) {
      toast.error('Sync Failed');
    }
  };

  const removeItem = async (productId) => {
    if (!productId) return;
    const loadingToast = toast.loading('Decommissioning unit...');

    try {
      if (user) {
        // Redux slice-এ filter লজিক ঠিক থাকলে এটা সাথে সাথে কাজ করবে
        await dispatch(removeFromCartAPI(productId)).unwrap();
      } else {
        dispatch(removeFromCartLocal(productId));
      }
      toast.success('Unit removed from buffer', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Removal failed', { id: loadingToast });
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);

  if (!mounted) return null;

  return (
    <section className="min-h-screen bg-bg py-12 md:py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[150px] rounded-full -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-text tracking-tighter uppercase italic mb-2">
              Storage <span className="text-primary">[</span>Bay
              <span className="text-primary">]</span>
            </h1>
            <p className="text-pText/50 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  user ? 'bg-primary animate-pulse shadow-[0_0_8px_#29fc56]' : 'bg-yellow-500'
                }`}
              />
              Sector: {user ? 'Cloud Sync Enabled' : 'Local Buffer Mode'}
            </p>
          </div>

          <Link
            href="/shop"
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-all flex items-center gap-2 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />{' '}
            Continue Looting
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            {/* Loading স্টেট শুধুমাত্র প্রথমবার ডেটা ফেচিং এর জন্য রাখা ভালো */}
            {loading && cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 border border-border/10 rounded-[2rem] bg-card/5 backdrop-blur-md">
                <Loader2 className="text-primary animate-spin mb-4" size={40} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">
                  Accessing Data Bank...
                </span>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <InternalCartItem
                    key={item.productId} // key সবসময় ইউনিক হতে হবে
                    item={item}
                    onUpdate={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-border/20 rounded-[3rem] bg-card/5 backdrop-blur-sm group">
                <ShoppingBag
                  size={64}
                  className="mx-auto text-pText/5 group-hover:text-primary/10 transition-colors duration-700 mb-8"
                />
                <p className="text-pText italic uppercase font-black tracking-[0.2em] mb-8 opacity-40">
                  Your bay is currently empty
                </p>
                <Link
                  href="/shop"
                  className="inline-block text-bg bg-primary font-black uppercase text-[10px] tracking-[0.2em] px-10 py-5 rounded-xl hover:shadow-[0_0_30px_rgba(41,252,86,0.4)] transition-all hover:-translate-y-1 active:scale-95"
                >
                  Return to Armory
                </Link>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 pb-10">
                <OrderSummary subtotal={subtotal} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
