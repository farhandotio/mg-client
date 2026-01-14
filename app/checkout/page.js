'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Truck,
  Plus,
  X,
  CheckCircle2,
  Phone,
  Home,
  Building2,
  Navigation,
} from 'lucide-react';

import { addAddress, getAddresses } from '@/store/features/authSlice';
import { createOrder } from '@/store/features/orderSlice';
import { initSSLPayment } from '@/store/features/paymentSlice';
import { clearCart } from '@/store/features/cartSlice';
import Button from '@/components/Button';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, addresses, loading: authLoading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.order);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Back-end Schema consistent state
  const [newAddress, setNewAddress] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Bangladesh',
    isDefault: false,
  });

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  // Set default address if available
  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(def);
    }
  }, [addresses, selectedAddress]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + shipping;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('Shipping Node Established');
      setShowAddressForm(false);
      setNewAddress({
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Bangladesh',
        isDefault: false,
      });
    } catch (err) {
      toast.error(err || 'Error adding coordinates');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a shipping node');
    if (cartItems.length === 0) return toast.error('Cart is empty');

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress: {
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
        country: selectedAddress.country,
      },
      payment: { method: paymentMethod },
      pricing: { itemsPrice: subtotal, shippingPrice: shipping, totalPrice: total },
    };

    try {
      const orderRes = await dispatch(createOrder(orderData)).unwrap();
      if (paymentMethod === 'ONLINE') {
        const payRes = await dispatch(initSSLPayment({ orderId: orderRes.orderId })).unwrap();
        if (payRes.gatewayUrl) window.location.replace(payRes.gatewayUrl);
      } else {
        toast.success('Order Transmission Successful');
        dispatch(clearCart());
        router.push(`/order-success/${orderRes.orderId}`);
      }
    } catch (err) {
      toast.error(err || 'Order execution failed');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="bg-card/40 backdrop-blur-xl p-12 rounded-[2.5rem] border border-border/50 text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Truck size={40} />
          </div>
          <h2 className="text-2xl font-black italic uppercase text-text mb-3">Void Cart</h2>
          <p className="text-pText text-sm mb-8 font-medium">
            No items found in your current session.
          </p>
          <Button
            onClick={() => router.push('/shop')}
            text="Return to Terminal"
            className="w-full py-4 rounded-2xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-text pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-4">
              Checkout
            </h1>
            <p className="text-xs font-bold text-pText uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" /> Secure Transaction Protocol
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Address Section */}
            <section className="bg-card/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-lg font-black uppercase italic flex items-center gap-3">
                  <MapPin className="text-primary" size={20} /> 01. Shipping Node
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="group flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-bg transition-all"
                  >
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Add
                    New Node
                  </button>
                )}
              </div>

              <div className="p-8">
                {showAddressForm || addresses?.length === 0 ? (
                  <form
                    onSubmit={handleAddAddress}
                    className="animate-in fade-in slide-in-from-top-4 duration-500"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <CheckoutInput
                        label="Phone Number"
                        icon={<Phone size={16} />}
                        placeholder="01XXXXXXXXX"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      />
                      <CheckoutInput
                        label="Street / House"
                        icon={<Home size={16} />}
                        placeholder="House 12, Road 5"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      />
                      <CheckoutInput
                        label="City"
                        icon={<Building2 size={16} />}
                        placeholder="Dhaka"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <CheckoutInput
                          label="State"
                          placeholder="Dhaka"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                        <CheckoutInput
                          label="Zip"
                          placeholder="1200"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-8">
                      <Button
                        type="submit"
                        text="Establish Node"
                        className="px-10 py-4 rounded-2xl"
                      />
                      {addresses?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="text-xs font-black uppercase tracking-widest text-pText hover:text-red-500 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, i) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`group relative p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
                          selectedAddress?._id === addr._id
                            ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(255,111,92,0.1)]'
                            : 'border-white/5 bg-bg/40 hover:border-white/20'
                        }`}
                      >
                        {selectedAddress?._id === addr._id && (
                          <div className="absolute top-0 right-0 p-3 text-primary animate-in zoom-in">
                            <CheckCircle2 size={20} fill="currentColor" className="text-primary" />
                          </div>
                        )}

                        <p className="font-black text-xs uppercase tracking-widest text-pText mb-4 flex items-center gap-2">
                          <Navigation
                            size={12}
                            className={selectedAddress?._id === addr._id ? 'text-primary' : ''}
                          />
                          Node {i + 1}
                        </p>
                        <h4 className="font-bold text-text mb-1 line-clamp-1">{addr.street}</h4>
                        <p className="text-pText text-[11px] font-bold uppercase tracking-wider mb-4">
                          {addr.city}, {addr.state} — {addr.zip}
                        </p>
                        <div
                          className={`text-[10px] font-mono py-1 px-3 rounded-lg w-fit transition-colors ${
                            selectedAddress?._id === addr._id
                              ? 'bg-primary text-bg font-bold'
                              : 'bg-white/5 text-pText'
                          }`}
                        >
                          {addr.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 2. Payment Section */}
            <section className="bg-card/30 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
              <h2 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3">
                <CreditCard className="text-primary" size={20} /> 02. Payment Protocol
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'COD', title: 'Cash on Delivery', desc: 'Settle upon transmission' },
                  { id: 'ONLINE', title: 'Digital Payment', desc: 'Secure SSL Encryption' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-4 p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(255,111,92,0.1)]'
                        : 'border-white/5 bg-bg/40 hover:border-white/10'
                    }`}
                  >
                    <div className="mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id ? 'border-primary' : 'border-white/20'
                        }`}
                      >
                        {paymentMethod === method.id && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      className="hidden"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <div>
                      <p
                        className={`font-black uppercase text-sm ${
                          paymentMethod === method.id ? 'text-primary' : 'text-text'
                        }`}
                      >
                        {method.title}
                      </p>
                      <p className="text-[10px] text-pText font-bold uppercase tracking-widest mt-1">
                        {method.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side: Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-[2.5rem] border border-white/5 p-8 sticky top-10 shadow-2xl overflow-hidden">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -z-10" />

              <h3 className="text-xl font-black italic uppercase mb-8 border-b border-white/5 pb-4">
                Summary
              </h3>

              <div className="space-y-4 mb-10 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="w-14 h-14 bg-bg rounded-xl border border-white/5 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase text-text truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-pText font-bold">QTY: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-mono font-black">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex justify-between text-pText text-[10px] font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="font-mono text-text">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-pText text-[10px] font-black uppercase tracking-widest">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-text">৳{shipping}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-sm font-black uppercase italic">Total</span>
                  <span className="text-3xl font-black text-primary font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,111,92,0.3)]">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handlePlaceOrder}
                disabled={orderLoading || authLoading}
                className="w-full mt-10 py-5 rounded-2xl shadow-lg shadow-primary/20"
                text={orderLoading ? 'Processing...' : 'Execute Order'}
              />

              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[9px] text-pText uppercase font-black tracking-[0.2em]">
                  SSL Encrypted Terminal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component for Checkout
function CheckoutInput({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-pText/60 ml-2">
        {label}
      </label>
      <div className="relative group">
        <input
          {...props}
          className="w-full bg-bg/50 border border-white/5 rounded-2xl p-4 text-xs font-bold text-text outline-none focus:border-primary/50 transition-all shadow-inner placeholder:text-pText/20 pl-11"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pText/40 group-focus-within:text-primary transition-colors">
          {icon || <Navigation size={16} />}
        </div>
      </div>
    </div>
  );
}
