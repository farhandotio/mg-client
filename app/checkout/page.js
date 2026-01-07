'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ShieldCheck, MapPin, CreditCard, Truck, Plus, X } from 'lucide-react';

// Redux Actions
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

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + shipping;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addAddress(newAddress)).unwrap();
      toast.success('Address Added!');
      setShowAddressForm(false);
      setNewAddress({ phone: '', street: '', city: '', state: '', zip: '', country: 'Bangladesh' });
    } catch (err) {
      toast.error(err?.message || 'Error adding address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a shipping address');
    if (cartItems.length === 0) return toast.error('Cart is empty');

    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        fullname: user?.fullname,
        phoneNumber: selectedAddress.phone,
        address: selectedAddress.street,
        city: selectedAddress.city,
        area: selectedAddress.state || selectedAddress.city,
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
        toast.success('Order Placed Successfully!');
        dispatch(clearCart());
        router.push(`/order-success/${orderRes.orderId}`);
      }
    } catch (err) {
      toast.error(err?.message || 'Order failed');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-bg p-6">
        <div className="bg-card p-10 rounded-2xl border border-border text-center">
          <Truck className="w-16 h-16 mx-auto mb-4 text-pText" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <button
            onClick={() => router.push('/shop')}
            className="mt-4 bg-primary px-6 py-2 rounded-full font-medium hover:bg-primary/95 transition"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-text pb-20 pt-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-10 flex items-center gap-3 tracking-tight">
          <ShieldCheck className="text-primary w-8 h-8" /> CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Side: Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Address Section */}
            <section className="bg-card backdrop-blur-md rounded-2xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="text-primary w-5 h-5" /> Shipping Information
                </h2>
                {!showAddressForm && addresses?.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
                  >
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              <div className="p-6">
                {showAddressForm || addresses?.length === 0 ? (
                  <form
                    onSubmit={handleAddAddress}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-pText font-bold ml-1">
                        Phone Number
                      </label>
                      <input
                        className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary outline-none transition"
                        placeholder="e.g. 01700000000"
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-pText font-bold ml-1">
                        Street Address
                      </label>
                      <input
                        className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary outline-none transition"
                        placeholder="House no, Road no"
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-pText font-bold ml-1">City</label>
                      <input
                        className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary outline-none transition"
                        placeholder="City"
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs uppercase text-pText font-bold ml-1">
                          Area/State
                        </label>
                        <input
                          className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary outline-none transition"
                          placeholder="Area"
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs uppercase text-pText font-bold ml-1">
                          Zip Code
                        </label>
                        <input
                          className="w-full bg-card border border-border rounded-xl p-3 focus:border-primary outline-none transition"
                          placeholder="1200"
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex gap-3 pt-2">
                      <Button type="submit" className="" text={'Save Address'} />
                      {addresses?.length > 0 && (
                        <Button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className=""
                          fillColor="bg-red-500"
                          text="Cancel"
                        />
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedAddress(addr)}
                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedAddress?._id === addr._id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card/30 hover:border-pText'
                        }`}
                      >
                        <div
                          className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedAddress?._id === addr._id
                              ? 'border-primary bg-primary'
                              : 'border-pText'
                          }`}
                        >
                          {selectedAddress?._id === addr._id && (
                            <div className="w-2 h-2 bg-bg rounded-full" />
                          )}
                        </div>
                        <p className="font-bold text-lg mb-1">{user?.fullname}</p>
                        <p className="text-pText text-sm leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                        </p>
                        <p className="text-pText text-xs mt-3 font-medium">PHONE: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* 2. Payment Section */}
            <section className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="text-primary w-5 h-5" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'COD', title: 'Cash on Delivery', desc: 'Pay when you receive the order' },
                  { id: 'ONLINE', title: 'Online Payment', desc: 'Secure payment via SSLCommerz' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card/30 hover:border-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="mt-1 accent-primary w-4 h-4"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <div>
                      <p className="font-bold">{method.title}</p>
                      <p className="text-xs text-pText mt-1 uppercase tracking-wider font-semibold">
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
            <div className="bg-card rounded-3xl border border-border p-8 sticky top-10 shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 tracking-tight border-b border-border pb-4">
                Order Summary
              </h3>

              <div className="space-y-5 mb-8 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text group-hover:text-green-400 transition cursor-default">
                        {item.title}
                      </span>
                      <span className="text-xs text-pText font-bold">QTY: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-mono font-bold tracking-tighter">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex justify-between text-pText">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="font-mono">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-pText">
                  <span className="text-sm font-medium">Shipping Fee</span>
                  <span className="font-mono">৳{shipping}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold text-text">Total Amount</span>
                  <span className="text-2xl font-black text-primary font-mono tracking-tighter">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handlePlaceOrder}
                disabled={orderLoading || authLoading}
                className="w-full mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
                text={orderLoading ? 'Processing...' : 'Confirm Order'}
              />

              <p className="text-[10px] text-pText text-center mt-6 uppercase font-bold tracking-widest">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
