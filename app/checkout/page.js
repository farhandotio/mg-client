'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';

import { addAddress, getAddresses } from '@/store/features/authSlice';
import { createOrder } from '@/store/features/orderSlice';
import { initSSLPayment } from '@/store/features/paymentSlice';
import { clearCart } from '@/store/features/cartSlice';
import Button from '@/components/Button';
import Link from 'next/link';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { addresses, loading: authLoading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
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
    dispatch(getAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(def);
    }
  }, [addresses, selectedAddress]);

  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const ship = sub > 0 ? 100 : 0;
    return { subtotal: sub, shipping: ship, total: sub + ship };
  }, [cartItems]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.phone || !newAddress.street || !newAddress.city) {
      return toast.error('দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন');
    }
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('নতুন ঠিকানা যোগ করা হয়েছে');
      setShowAddressForm(false);
      setNewAddress({ phone: '', street: '', city: '', state: '', zip: '', country: 'Bangladesh' });
    } catch (err) {
      toast.error('ঠিকানা যোগ করতে ব্যর্থ হয়েছে');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('ডেলিভারি ঠিকানা নির্বাচন করুন');

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
        toast.success('আপনার অর্ডারটি গ্রহণ করা হয়েছে');
        dispatch(clearCart());
        router.push(`/order-success/${orderRes.orderId}`);
      }
    } catch (err) {
      toast.error('অর্ডার সম্পন্ন করা যায়নি');
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-bg min-h-screen text-text pb-16 pt-4 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* টপ নেভিগেশন */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-bold text-pText hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> ব্যাগে ফিরুন
          </Link>
          <div className="text-center hidden md:block">
            <h1 className="text-xl font-black uppercase italic tracking-widest">
              নিরাপদ <span className="text-primary">চেকআউট</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <ShieldCheck size={12} /> নিরাপদ লেনদেন
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* বাম পাশ: ইনফরমেশন */}
          <div className="lg:col-span-7 space-y-5">
            {/* ১. ঠিকানা সেকশন */}
            <section className="bg-card/20 border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border/40 bg-white/5 flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={16} className="text-primary" /> ১. ডেলিভারি ঠিকানা
                </h2>
                {!showAddressForm && addresses?.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
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
                        placeholder="যেমন: ঢাকা"
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
                        className="bg-primary text-bg px-6 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                      >
                        ঠিকানা সংরক্ষণ করুন
                      </button>
                      {addresses?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 text-[11px] font-bold text-pText uppercase hover:text-white transition-colors"
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
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedAddress?._id === addr._id
                            ? 'border-primary bg-primary/5'
                            : 'border-border/30 bg-bg/40'
                        }`}
                      >
                        {selectedAddress?._id === addr._id && (
                          <CheckCircle2 size={16} className="absolute top-3 right-3 text-primary" />
                        )}
                        <p className="text-[9px] font-black text-pText/50 uppercase tracking-tighter mb-1">
                          ঠিকানা নোড
                        </p>
                        <h4 className="font-bold text-xs text-text truncate mb-1">{addr.street}</h4>
                        <p className="text-pText text-[10px] mb-2">
                          {addr.city}, {addr.state}
                        </p>
                        <div className="text-[10px] font-mono text-primary font-bold">
                          {addr.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ২. পেমেন্ট পদ্ধতি */}
            <section className="bg-card/20 border border-border/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border/40 bg-white/5">
                <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" /> ২. পেমেন্ট পদ্ধতি
                </h2>
              </div>
              <div className="p-5">
                <div className="max-w-md">
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-inner' : 'border-border/30 bg-bg/40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-primary text-bg' : 'bg-white/5 text-pText'}`}
                      >
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase">ক্যাশ অন ডেলিভারি</p>
                        <p className="text-[10px] text-pText font-bold uppercase tracking-tighter">
                          পণ্য বুঝে পেয়ে টাকা পরিশোধ করুন
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      className="accent-primary w-4 h-4"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* ডান পাশ: সামারি (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border/40 rounded-2xl p-5 md:p-6 sticky top-6 shadow-2xl">
              <h3 className="text-sm font-black uppercase italic border-b border-border/20 pb-4 mb-5 flex justify-between items-center">
                অর্ডার সামারি <span>{cartItems.length} টি পণ্য</span>
              </h3>

              <div className="space-y-3 mb-6 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-center bg-bg/40 p-2 rounded-xl border border-white/5"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                      <img
                        src={item.image}
                        className="w-full h-full object-contain p-1"
                        alt={item.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase text-text truncate">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-pText font-bold">
                        পরিমাণ: {item.quantity} × ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-[11px] font-black text-text font-mono">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-5 border-t border-border/20">
                <div className="flex justify-between text-[10px] font-bold text-pText uppercase tracking-widest">
                  <span>পণ্যের মূল্য</span>
                  <span className="text-text font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-pText uppercase tracking-widest">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-text font-mono">৳{shipping}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase italic text-primary">
                      সর্বমোট প্রদেয়
                    </span>
                  </div>
                  <span className="text-3xl font-black text-primary font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={orderLoading || authLoading}
                className="w-full mt-8 py-5 rounded-2xl shadow-[0_10px_20px_rgba(var(--primary-rgb),0.15)] group transition-all"
                text={orderLoading ? 'প্রসেসিং...' : 'অর্ডার সম্পন্ন করুন'}
                icon={ChevronRight}
              />

              <p className="text-[8px] font-bold uppercase text-pText/40 mt-5 text-center tracking-[0.2em] flex items-center justify-center gap-2">
                <ShieldCheck size={12} className="text-primary" /> SSL এনক্রিপ্টেড পেমেন্ট গেটওয়ে
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutInput({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase tracking-wider text-pText ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          {...props}
          className="w-full bg-bg/50 border border-border/40 rounded-xl p-3 text-[11px] font-bold text-text outline-none focus:border-primary transition-all pl-10 placeholder:text-pText"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pText group-focus-within:text-primary transition-colors">
          {icon || <Navigation size={14} />}
        </div>
      </div>
    </div>
  );
}
