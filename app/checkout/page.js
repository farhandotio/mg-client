'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Truck,
  Plus,
  CheckCircle2,
  Phone,
  Home,
  Building2,
  Navigation,
  ArrowLeft,
  ChevronRight,
  Trash2,
  Minus,
  Loader2,
} from 'lucide-react';

import { addAddress, getAddresses } from '@/store/features/authSlice';
import { createOrder } from '@/store/features/orderSlice';
import { initSSLPayment } from '@/store/features/paymentSlice';
import {
  clearCart,
  removeFromCartAPI,
  updateCartQuantityAPI,
  removeFromCartLocal,
  updateQuantityLocal,
} from '@/store/features/cartSlice';
import Button from '@/components/Button';
import Link from 'next/link';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, addresses, loading: authLoading } = useSelector((state) => state.auth);
  const { cartItems, loading: cartLoading } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.order);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
  });

  useEffect(() => {
    if (user) dispatch(getAddresses());
  }, [dispatch, user]);

  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(def);
    }
  }, [addresses, selectedAddress]);

  // --- ডেলিভারি চার্জ লজিক (খুলনা ৬০, বাকিরা ১২০) ---
  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    let ship = 0;
    if (sub > 0) {
      const stateLower = selectedAddress?.state?.toLowerCase() || '';
      const isKhulna = stateLower.includes('khulna') || stateLower.includes('খুলনা');
      ship = isKhulna ? 60 : 150;
    }

    return { subtotal: sub, shipping: ship, total: sub + ship };
  }, [cartItems, selectedAddress]);

  // --- কার্ট ম্যানেজমেন্ট ফাংশনস ---
  const handleUpdateQty = (productId, currentQty, action) => {
    if (user) {
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;
      dispatch(updateCartQuantityAPI({ productId, action, sessionId }));
    } else {
      const delta = action === 'increase' ? 1 : -1;
      if (action === 'decrease' && currentQty <= 1) return;
      dispatch(updateQuantityLocal({ productId, delta }));
    }
  };

  const handleRemoveItem = (productId) => {
    if (user) {
      dispatch(removeFromCartAPI(productId));
    } else {
      dispatch(removeFromCartLocal(productId));
    }
    toast.success('আইটেমটি সরানো হয়েছে');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.phone || !newAddress.street || !newAddress.city) {
      return toast.error('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন');
    }
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('নতুন ঠিকানা যোগ করা হয়েছে');
      setShowAddressForm(false);
      setNewAddress({ phone: '', street: '', city: '', state: '', zip: '', country: 'Bangladesh' });
    } catch (err) {
      toast.error('ঠিকানা যোগ করতে ব্যর্থ হয়েছে');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('ডেলিভারি ঠিকানা নির্বাচন করুন');
    if (cartItems.length === 0) return toast.error('আপনার কার্ট খালি');

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress: selectedAddress,
      payment: { method: paymentMethod },
      pricing: { itemsPrice: subtotal, shippingPrice: shipping, totalPrice: total },
    };

    try {
      const orderRes = await dispatch(createOrder(orderData)).unwrap();
      if (paymentMethod === 'ONLINE') {
        const payRes = await dispatch(initSSLPayment({ orderId: orderRes.orderId })).unwrap();
        if (payRes.gatewayUrl) window.location.replace(payRes.gatewayUrl);
      } else {
        toast.success('আপনার অর্ডারটি গ্রহণ করা হয়েছে');
        dispatch(clearCart());
        router.push(`/order-success/${orderRes.orderId}`);
      }
    } catch (err) {
      toast.error('অর্ডার সম্পন্ন করা যায়নি');
    }
  };

  if (cartItems.length === 0 && !cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-medium uppercase italic">আপনার কার্ট খালি!</h2>
        <Link href="/">
          <Button text="কেনাকাটা চালিয়ে যান" icon={ArrowLeft} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-text pb-16 pt-4 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* টপ নেভিগেশন */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-medium text-pText hover:text-primary transition-colors uppercase tracking-tighter"
          >
            <ArrowLeft size={16} /> ব্যাগে ফিরুন
          </Link>
          <div className="text-center hidden md:block">
            <h1 className="text-xl font-medium uppercase italic tracking-tighter">
              নিরাপদ <span className="text-primary">চেকআউট</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <ShieldCheck size={12} /> নিরাপদ লেনদেন
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* বাম পাশ: ইনফরমেশন */}
          <div className="lg:col-span-7 space-y-6">
            {/* ঠিকানা সেকশন */}
            <section className="bg-card/20 border border-border/40 rounded-0 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border/40 bg-white/5 flex justify-between items-center">
                <h2 className="text-xs font-medium uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={16} className="text-primary" /> ১. ডেলিভারি ঠিকানা
                </h2>
                {!showAddressForm && addresses?.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-[12px] font-medium text-primary flex items-center gap-1 hover:underline uppercase tracking-tighterer"
                  >
                    <Plus size={14} /> নতুন ঠিকানা
                  </button>
                )}
              </div>

              <div className="p-5">
                {showAddressForm || addresses?.length === 0 ? (
                  <form
                    onSubmit={handleAddAddress}
                    className="space-y-4 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CheckoutInput
                        label="ফোন নম্বর *"
                        icon={<Phone size={14} />}
                        placeholder="017XXXXXXXX"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      />
                      <CheckoutInput
                        label="শহর *"
                        icon={<Building2 size={14} />}
                        placeholder="যেমন: খুলনা অথবা ঢাকা"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                      <div className="md:col-span-2">
                        <CheckoutInput
                          label="বিস্তারিত ঠিকানা (বাসা/রাস্তা/এলাকা) *"
                          icon={<Home size={14} />}
                          placeholder="বাসা নং ১২, রোড ৫, উত্তরা"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        />
                      </div>
                      <CheckoutInput
                        label="পোস্ট কোড"
                        placeholder="১২৩০"
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                      />
                      <CheckoutInput
                        label="বিভাগ"
                        placeholder="ঢাকা"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="bg-primary text-bg px-6 py-2.5 rounded-0 text-[11px] font-medium uppercase hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                      >
                        ঠিকানা সংরক্ষণ করুন
                      </button>
                      {addresses?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 text-[11px] font-medium text-pText uppercase hover:text-white transition-colors"
                        >
                          বাতিল
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`relative p-4 rounded-0 border-2 transition-all cursor-pointer ${selectedAddress?._id === addr._id ? 'border-primary bg-primary/5 shadow-md' : 'border-border/30 bg-bg/40'}`}
                      >
                        {selectedAddress?._id === addr._id && (
                          <CheckCircle2 size={16} className="absolute top-3 right-3 text-primary" />
                        )}
                        <p className="text-[10px] font-medium text-pText/50 uppercase tracking-tighterer mb-1">
                          শিপিং ঠিকানা
                        </p>
                        <h4 className="font-medium text-xs text-text truncate mb-1 italic">
                          {addr.street}
                        </h4>
                        <p className="text-pText text-[12px]">
                          {addr.city}, {addr.state}
                        </p>
                        <div className="text-[12px] font-mono text-primary font-medium mt-2">
                          {addr.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* পেমেন্ট পদ্ধতি */}
            <section className="bg-card/20 border border-border/40 rounded-0 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border/40 bg-white/5">
                <h2 className="text-xs font-medium uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" /> ২. পেমেন্ট পদ্ধতি
                </h2>
              </div>
              <div className="p-5 flex flex-wrap gap-4">
                <PaymentOption
                  active={paymentMethod === 'COD'}
                  onClick={() => setPaymentMethod('COD')}
                  icon={<Truck size={20} />}
                  title="ক্যাশ অন ডেলিভারি"
                />
                <PaymentOption
                  active={paymentMethod === 'ONLINE'}
                  onClick={() => setPaymentMethod('ONLINE')}
                  icon={<CreditCard size={20} />}
                  title="অনলাইন পেমেন্ট"
                />
              </div>
            </section>
          </div>

          {/* ডান পাশ: সামারি (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border/40 rounded-0 p-5 md:p-6 sticky top-6 shadow-2xl">
              <h3 className="text-sm font-medium uppercase italic border-b border-border/20 pb-4 mb-5 flex justify-between items-center">
                অর্ডার সামারি <span>{cartItems.length} টি পণ্য</span>
              </h3>

              <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 items-center bg-bg/40 p-2.5 rounded-0 border border-white/5 group relative"
                  >
                    <div className="w-14 h-14 rounded-0 overflow-hidden bg-white shrink-0 border border-border/20">
                      <img
                        src={item.image}
                        className="w-full h-full object-contain p-1 transition-transform group-hover:scale-110"
                        alt={item.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-[11px] font-medium uppercase text-text truncate pr-4">
                          {item.title}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-pText hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* অ্যাড/ডিক্রেস কন্ট্রোল */}
                        <div className="flex items-center gap-3 bg-card border border-border/40 rounded px-2 py-0.5">
                          <button
                            onClick={() =>
                              handleUpdateQty(item.productId, item.quantity, 'decrease')
                            }
                            className="text-pText hover:text-primary disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="text-xs font-medium italic">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQty(item.productId, item.quantity, 'increase')
                            }
                            className="text-pText hover:text-primary"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                        <span className="text-[11px] font-medium text-primary font-mono italic">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-5 border-t border-border/20">
                <div className="flex justify-between text-[12px] font-medium text-pText uppercase tracking-tighter">
                  <span>পণ্যের মূল্য</span>
                  <span className="text-text font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[12px] font-medium text-pText uppercase tracking-tighter">
                  <span>ডেলিভারি চার্জ {selectedAddress?.city && `(${selectedAddress.city})`}</span>
                  <span className="text-text font-mono">৳{shipping}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <span className="text-[11px] font-medium uppercase italic text-primary tracking-tighter">
                    মোট প্রদেয়
                  </span>
                  <span className="text-3xl font-medium text-primary font-mono tracking-tighterer drop-shadow-sm">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={orderLoading || authLoading}
                className="w-full mt-8 py-5 rounded-0 shadow-xl shadow-primary/10 uppercase tracking-tighter text-[11px] font-medium"
                text={orderLoading ? 'প্রসেসিং...' : 'অর্ডার সম্পন্ন করুন'}
                icon={ChevronRight}
              />

              <p className="text-[10px] font-medium uppercase text-pText/40 mt-5 text-center tracking-tighter flex items-center justify-center gap-2">
                <ShieldCheck size={12} className="text-primary" /> SSL এনক্রিপ্টেড পেমেন্ট গেটওয়ে
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- হেল্পার কম্পোনেন্ট ---
function PaymentOption({ active, onClick, icon, title }) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 flex items-center gap-3 p-4 rounded-0 border-2 cursor-pointer transition-all ${active ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-border/20 bg-bg/40'}`}
    >
      <div className={`${active ? 'text-primary' : 'text-pText opacity-40'}`}>{icon}</div>
      <span className="text-[11px] font-medium uppercase tracking-tighterer">{title}</span>
    </div>
  );
}

function CheckoutInput({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium uppercase tracking-wider text-pText/60 ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          {...props}
          className="w-full bg-bg/50 border border-border/40 rounded-0 p-3 text-[11px] font-medium text-text outline-none focus:border-primary transition-all pl-10 placeholder:text-pText/30"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pText group-focus-within:text-primary transition-colors">
          {icon || <Navigation size={14} />}
        </div>
      </div>
    </div>
  );
}
